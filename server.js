const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS，允许前端跨域请求
app.use(cors());
// 解析JSON请求体
app.use(express.json());

// 压力测试统计
let stats = {
  totalRequests: 0,
  successRequests: 0,
  failedRequests: 0,
  avgResponseTime: 0
};

// 模拟的API端点
app.get('/api/test', (req, res) => {
  const startTime = Date.now();
  stats.totalRequests++;

  // 模拟随机响应时间 (50ms - 1000ms)
  const delay = Math.floor(Math.random() * 950) + 50;
  
  // 模拟成功率 (默认90%成功)
  const successRate = 0.90;
  const isSuccess = Math.random() < successRate;
  
  setTimeout(() => {
    const responseTime = Date.now() - startTime;
    
    // 更新平均响应时间
    stats.avgResponseTime = (stats.avgResponseTime * (stats.totalRequests - 1) + responseTime) / stats.totalRequests;
    
    if (isSuccess) {
      stats.successRequests++;
      res.status(200).json({
        status: 'success',
        message: '请求处理成功',
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        data: {
          server: '压力测试后端',
          version: '1.0.0',
          load: Math.random().toFixed(2)
        }
      });
    } else {
      stats.failedRequests++;
      // 模拟各种错误
      const errors = [400, 401, 403, 404, 429, 500, 502, 503];
      const errorCode = errors[Math.floor(Math.random() * errors.length)];
      
      res.status(errorCode).json({
        status: 'error',
        message: `模拟错误: HTTP ${errorCode}`,
        errorCode: errorCode,
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`
      });
    }
  }, delay);
});

// 获取实时统计信息
app.get('/api/stats', (req, res) => {
  res.json({
    ...stats,
    failureRate: stats.totalRequests > 0 
      ? ((stats.failedRequests / stats.totalRequests) * 100).toFixed(2) + '%'
      : '0%',
    timestamp: new Date().toISOString()
  });
});

// 重置统计数据
app.post('/api/stats/reset', (req, res) => {
  stats = {
    totalRequests: 0,
    successRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0
  };
  res.json({ message: '统计数据已重置', stats });
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: '压力测试模拟API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 首页
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>压力测试后端</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>压力测试后端服务</h1>
      <p>可用的API端点：</p>
      <div class="endpoint"><strong>GET /api/test</strong> - 主要测试端点（模拟延迟和随机响应）</div>
      <div class="endpoint"><strong>GET /api/stats</strong> - 获取实时统计数据</div>
      <div class="endpoint"><strong>POST /api/stats/reset</strong> - 重置统计数据</div>
      <div class="endpoint"><strong>GET /api/health</strong> - 健康检查</div>
    </body>
    </html>
  `);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 访问 http://localhost:${PORT}/api/stats 查看统计`);
});
