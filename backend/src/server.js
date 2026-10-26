const { initializeDatabase } = require('./db');
const createApp = require('./app');

const PORT = process.env.PORT || 5000;

/**
 * Start the Employee Management System API server.
 * Initializes the database and listens on the configured port.
 */
async function startServer() {
  try {
    // Initialize database with default file path
    const db = await initializeDatabase();

    // Create and start the Express app
    const app = createApp(db);

    const server = app.listen(PORT, () => {
      console.log(`Employee Management System API running on http://localhost:${PORT}`);
    });

    // Graceful shutdown: close database and server on process exit
    const shutdown = () => {
      console.log('\nShutting down gracefully...');
      db.close();
      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
