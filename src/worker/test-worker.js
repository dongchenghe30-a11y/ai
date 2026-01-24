export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    console.log('Request received:', url.pathname, request.method);

    // 处理 OPTIONS 预检请求（必须在其他路由之前）
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    // 健康检查
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          worker: 'running',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 测试 AI 端点（不需要 AI 调用）
    if (url.pathname === '/api/ai/analyze' && request.method === 'POST') {
      try {
        const { jobDescription } = await request.json();
        console.log('Test analyze request received');

        // 返回模拟数据，不调用 AI
        return new Response(
          JSON.stringify({
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
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders
    });
  },
};
