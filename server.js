const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let stats = {
  totalRequests: 0,
  successRequests: 0,
  failedRequests: 0,
  avgResponseTime: 0
};

app.get('/api/test', (req, res) => {
  const startTime = Date.now();
  stats.totalRequests++;
  const delay = Math.floor(Math.random() * 950) + 50;
  const isSuccess = Math.random() < 0.9;

  setTimeout(() => {
    const rt = Date.now() - startTime;
    stats.avgResponseTime = (stats.avgResponseTime * (stats.totalRequests - 1) + rt) / stats.totalRequests;

    if (isSuccess) {
      stats.successRequests++;
      res.json({ status: 'ok', rt: rt+'ms' });
    } else {
      stats.failedRequests++;
      res.status(500).json({ status: 'error' });
    }
  }, delay);
});

app.get('/api/stats', (req, res) => res.json(stats));

// 关键：导出 app 给 Vercel 识别
module.exports = app;
