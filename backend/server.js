const path = require('path');
const express = require('express');
const cors = require('cors');
const claimsRouter = require('./routes/claims');
const aiRouter = require('./routes/ai');
const resubmitRouter = require('./routes/resubmit');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/claims', claimsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/resubmit', resubmitRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PF Sathi Unified Server', version: '1.0.0' });
});

// Demo UANs endpoint
app.get('/api/demo-uans', (req, res) => {
  res.json({
    success: true,
    message: 'Use any of these UANs to explore the demo:',
    uans: [
      { uan: '100123456789', name: 'Rajesh Kumar', claimCount: 3 },
      { uan: '100987654321', name: 'Priya Sharma', claimCount: 3 },
      { uan: '100555666777', name: 'Amit Patel', claimCount: 2 }
    ]
  });
});

// Serve frontend static files
app.use(express.static(FRONTEND_DIST));

// SPA fallback: any non-API route serves the frontend index.html
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║     🤝 PF Sathi Unified Server (App + API)            ║
  ║     App & API running on: http://localhost:${PORT}        ║
  ╚════════════════════════════════════════════════════════╝
  `);
});
