export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 添加调试日志
    console.log('Worker received request:', url.pathname, request.method);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/ai/analyze' && request.method === 'POST') {
      try {
        const { jobDescription } = await request.json();
        console.log('Analyze request received:', jobDescription?.substring(0, 50) + '...');

        // 检查 AI 是否可用
        if (!env.AI) {
          console.error('AI binding not configured');
          return new Response(
            JSON.stringify({ 
              error: 'AI not configured. Please add AI binding in Worker settings.',
              details: 'Go to Worker Settings > Variables and Secrets > Service Bindings > Add binding > Name: AI, Service: AI'
            }), 
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const prompt = `Analyze this job description and provide keyword suggestions for optimizing a resume. Format the response as a JSON object with:
- keywords: array of objects with keyword, category, importance (high/medium/low), and suggestion
- suggestions: array of improvement tips
- summary: brief analysis

Job Description:
${jobDescription}

Respond with valid JSON only.`;

        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          prompt,
          max_tokens: 1024,
        });

        let aiResponse = response.response || response;
        console.log('AI response received:', typeof aiResponse);

        try {
          const cleanedResponse = aiResponse
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          aiResponse = JSON.parse(cleanedResponse);
        } catch (e) {
          console.warn('Failed to parse AI response, using fallback');
          aiResponse = {
            keywords: [
              {
                keyword: 'Problem-solving',
                category: 'Soft Skills',
                importance: 'high',
                suggestion: 'Include specific examples of problems you solved and their outcomes',
              },
              {
                keyword: 'Communication',
                category: 'Soft Skills',
                importance: 'high',
                suggestion: 'Highlight teamwork and cross-functional collaboration',
              },
            ],
            suggestions: [
              'Quantify your achievements with numbers and percentages',
              'Use action verbs at the start of bullet points',
              'Match key terms from the job description',
            ],
            summary: 'Focus on skills and experience directly relevant to the position',
          };
        }

        return new Response(JSON.stringify(aiResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Analysis error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Analysis failed',
            message: error.message,
            suggestion: 'Please ensure AI is enabled in Cloudflare Workers settings'
          }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    if (url.pathname === '/api/ai/generate-experience' && request.method === 'POST') {
      try {
        const { jobTitle, company, keyPoints } = await request.json();
        console.log('Generate experience request:', jobTitle);

        if (!env.AI) {
          return new Response(
            JSON.stringify({ error: 'AI not configured' }), 
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const prompt = `Write a professional job description for a ${jobTitle} at ${company}. Use these key points:
${keyPoints.map((point) => `- ${point}`).join('\n')}

Requirements:
- Write in first person ("I led...", "I managed...")
- Use strong action verbs
- Include quantifiable achievements where appropriate
- Keep it concise but detailed (3-5 sentences)
- Make it ATS-friendly with relevant keywords

Respond with the description text only.`;

        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          prompt,
          max_tokens: 512,
        });

        const description = response.response || response;

        return new Response(JSON.stringify({
          description: typeof description === 'string' ? description : String(description),
          improvements: [
            'Add specific metrics and KPIs',
            'Include technologies/tools used',
            'Mention team size and scope',
          ],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Generation error:', error);
        return new Response(
          JSON.stringify({ error: 'Generation failed' }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    if (url.pathname === '/api/ai/translate' && request.method === 'POST') {
      try {
        const { text, sourceLang, targetLang } = await request.json();
        console.log('Translate request:', sourceLang, '->', targetLang);

        if (!env.AI) {
          return new Response(
            JSON.stringify({ error: 'AI not configured' }), 
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const langNames = {
          en: 'English',
          zh: 'Chinese',
        };

        const prompt = `Translate the following text from ${langNames[sourceLang]} to ${langNames[targetLang]}. Maintain professional tone appropriate for a resume.

Text: ${text}

Provide the translation only, without explanations.`;

        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          prompt,
          max_tokens: 512,
        });

        const translatedText = response.response || response;

        return new Response(JSON.stringify({
          translatedText: typeof translatedText === 'string' ? translatedText : String(translatedText),
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Translation error:', error);
        return new Response(
          JSON.stringify({ error: 'Translation failed' }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    if (url.pathname === '/api/ai/optimize' && request.method === 'POST') {
      try {
        const resumeData = await request.json();
        console.log('Optimize request received');

        if (!env.AI) {
          return new Response(
            JSON.stringify({ error: 'AI not configured' }), 
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const prompt = `Review this resume and provide optimization suggestions for ATS systems and overall quality. Format as JSON with:
- atsScore: number 0-100
- missingKeywords: array of strings
- suggestions: array of improvement recommendations

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Respond with valid JSON only.`;

        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          prompt,
          max_tokens: 1024,
        });

        let aiResponse = response.response || response;

        try {
          const cleanedResponse = aiResponse
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          aiResponse = JSON.parse(cleanedResponse);
        } catch {
          aiResponse = {
            atsScore: 75,
            missingKeywords: ['Problem-solving', 'Communication', 'Leadership'],
            suggestions: [
              'Add more quantifiable achievements',
              'Include relevant industry keywords',
              'Improve formatting for ATS parsing',
            ],
          };
        }

        return new Response(JSON.stringify(aiResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Optimization error:', error);
        return new Response(
          JSON.stringify({ error: 'Optimization failed' }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // 健康检查端点
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return new Response(
        JSON.stringify({ 
          status: 'ok', 
          aiConfigured: !!env.AI,
          timestamp: new Date().toISOString()
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};
