// Cloudflare Worker - CORS 修复版本
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers - 完整配置
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // 允许所有来源
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400', // 24小时
      'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
    };

    // 处理 OPTIONS 预检请求 - 必须第一个处理
    if (request.method === 'OPTIONS') {
      console.log('Handling OPTIONS preflight request for:', url.pathname);

      // 返回 200 OK，不包含 body
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    console.log('Request received:', url.pathname, request.method);

    // 健康检查端点
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          worker: 'running',
          cors: 'enabled',
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 职位描述分析端点
    if (url.pathname === '/api/ai/analyze' && request.method === 'POST') {
      try {
        const { jobDescription } = await request.json();
        console.log('Analyze request received');

        if (!jobDescription || jobDescription.trim() === '') {
          return new Response(
            JSON.stringify({ error: 'Job description is required' }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            }
          );
        }

        // 返回模拟数据（测试用）
        const response = {
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
            {
              keyword: 'Leadership',
              category: 'Soft Skills',
              importance: 'medium',
              suggestion: 'Show examples of leading teams or projects',
            },
          ],
          suggestions: [
            'Quantify your achievements with numbers and percentages',
            'Use action verbs at the start of bullet points',
            'Match key terms from the job description',
            'Include relevant certifications and technologies',
          ],
          summary: 'Focus on skills and experience directly relevant to the position. Use specific examples and measurable results.',
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });

      } catch (error) {
        console.error('Analyze error:', error);

        return new Response(
          JSON.stringify({
            error: 'Analysis failed',
            message: error.message || 'Unknown error',
            suggestion: 'Please check the request format and try again'
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // 工作经历生成端点
    if (url.pathname === '/api/ai/generate-experience' && request.method === 'POST') {
      try {
        const { jobTitle, company, keyPoints } = await request.json();
        console.log('Generate experience request:', jobTitle);

        if (!jobTitle || !company) {
          return new Response(
            JSON.stringify({ error: 'Job title and company are required' }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            }
          );
        }

        const response = {
          description: `I worked as a ${jobTitle} at ${company}, where I ${keyPoints && keyPoints.length > 0 ? keyPoints[0] : 'contributed to various projects'}. I successfully led cross-functional teams and delivered measurable results that improved efficiency by 25%.`,
          improvements: [
            'Add specific metrics and KPIs',
            'Include technologies and tools used',
            'Mention team size and scope of projects',
            'Highlight specific achievements and outcomes',
          ]
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });

      } catch (error) {
        console.error('Generation error:', error);

        return new Response(
          JSON.stringify({ error: 'Generation failed' }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // 翻译端点
    if (url.pathname === '/api/ai/translate' && request.method === 'POST') {
      try {
        const { text, sourceLang, targetLang } = await request.json();
        console.log('Translate request:', sourceLang, '->', targetLang);

        if (!text) {
          return new Response(
            JSON.stringify({ error: 'Text is required' }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            }
          );
        }

        const response = {
          translatedText: sourceLang === 'en' ? text + ' (Translated)' : 'Translation: ' + text
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });

      } catch (error) {
        console.error('Translation error:', error);

        return new Response(
          JSON.stringify({ error: 'Translation failed' }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // 简历优化端点
    if (url.pathname === '/api/ai/optimize' && request.method === 'POST') {
      try {
        const resumeData = await request.json();
        console.log('Optimize request received');

        const response = {
          atsScore: 78,
          missingKeywords: [
            'Problem-solving',
            'Communication',
            'Leadership',
            'Team collaboration'
          ],
          suggestions: [
            'Add more quantifiable achievements',
            'Include relevant industry keywords',
            'Improve formatting for ATS parsing',
            'Add measurable outcomes',
            'Include specific software and tools'
          ]
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });

      } catch (error) {
        console.error('Optimization error:', error);

        return new Response(
          JSON.stringify({ error: 'Optimization failed' }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // 404 - 路由不存在
    return new Response(
      JSON.stringify({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
        availableEndpoints: [
          'GET /health',
          'POST /api/ai/analyze',
          'POST /api/ai/generate-experience',
          'POST /api/ai/translate',
          'POST /api/ai/optimize'
        ]
      }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  },
};
