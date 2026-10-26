const express = require('express');
const cors = require('cors');
const createEmployeesRouter = require('./routes/employees');
const createDashboardRouter = require('./routes/dashboard');

/**
 * Create and configure the Express application.
 * @param {import('better-sqlite3').Database} db - The database instance to use.
 * @returns {express.Application} The configured Express app.
 */
function createApp(db) {
  const app = express();

  // Middleware
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }));
  app.use(express.json());

  // Routes
  app.use('/api/employees', createEmployeesRouter(db));
  app.use('/api/dashboard', createDashboardRouter(db));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler for unmatched routes
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
