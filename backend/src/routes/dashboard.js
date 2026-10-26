const express = require('express');

/**
 * Create the dashboard router using Prisma ORM.
 * @param {import('@prisma/client').PrismaClient} prisma - The PrismaClient instance.
 * @returns {express.Router} Configured Express router.
 */
function createDashboardRouter(prisma) {
  const router = express.Router();

  /**
   * GET /api/dashboard
   * Returns employee statistics: total count, active count, and inactive count.
   */
  router.get('/', async (req, res) => {
    try {
      const [total, active, inactive] = await Promise.all([
        prisma.employee.count(),
        prisma.employee.count({ where: { status: 'active' } }),
        prisma.employee.count({ where: { status: 'inactive' } }),
      ]);

      res.json({ total, active, inactive });
    } catch (err) {
      console.error('Error fetching dashboard stats with Prisma:', err.message);
      res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  });

  return router;
}

module.exports = createDashboardRouter;
