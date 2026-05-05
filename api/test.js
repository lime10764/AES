export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const startTime = Date.now();
  const delay = Math.floor(Math.random() * 950) + 50;
  const isSuccess = Math.random() < 0.9;

  await new Promise(resolve => setTimeout(resolve, delay));
  const responseTime = Date.now() - startTime;

  res.setHeader('Access-Control-Allow-Origin', '*');
  if (isSuccess) {
    return res.status(200).json({
      status: 'ok',
      responseTime: `${responseTime}ms`
    });
  } else {
    return res.status(500).json({
      status: 'error',
      responseTime: `${responseTime}ms`
    });
  }
}
