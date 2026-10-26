const express = require('express');

/**
 * Create the dashboard router.
 * @param {import('better-sqlite3').Database} db - The database instance.
 * @returns {express.Router} Configured Express router for dashboard endpoints.
 */
function createDashboardRouter(db) {
  const router = express.Router();

  /**
   * GET /api/dashboard
   * Returns employee statistics: total count, active count, and inactive count.
   */
  router.get('/', (req, res) => {
    try {
      const total = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
      const active = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status = 'active'").get().count;
      const inactive = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status = 'inactive'").get().count;

      res.json({ total, active, inactive });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err.message);
      res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  });

  return router;
}

module.exports = createDashboardRouter;
