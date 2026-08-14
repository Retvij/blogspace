const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDB } = require('./config/db');
const seedData = require('./seed/seedData');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

// REST API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Standard Blog Platform API Engine',
    timestamp: new Date().toISOString(),
  });
});

// Auto-Shutdown Watchdog for zero memory footprint when tab closes
let lastHeartbeatTime = Date.now();
const startupTime = Date.now();

app.post('/api/system/heartbeat', (req, res) => {
  lastHeartbeatTime = Date.now();
  res.status(200).json({ status: 'alive' });
});

app.post('/api/system/shutdown', (req, res) => {
  res.status(200).json({ status: 'shutting_down' });
  console.log('\n[Auto-Shutdown] Browser window closed. Freeing system memory...');
  setTimeout(() => process.exit(0), 1000);
});

setInterval(() => {
  if (Date.now() - startupTime > 45000 && Date.now() - lastHeartbeatTime > 20000) {
    console.log('\n[Auto-Shutdown] No active browser windows detected. Server auto-closed.');
    process.exit(0);
  }
}, 5000);

// Serve frontend static build if it exists
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Standard Blog Platform Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Fatal Server Error:', err);
    process.exit(1);
  }
};

startServer();
