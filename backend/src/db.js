const { getPrismaClient } = require('./prisma');

/**
 * Initialize the Prisma database connection.
 * @param {string} [databaseUrl] - Optional custom database URL (e.g. for testing)
 * @returns {import('@prisma/client').PrismaClient}
 */
async function initializeDatabase(databaseUrl) {
  const options = databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {};
  const prisma = getPrismaClient(options);
  await prisma.$connect();
  return prisma;
}

module.exports = { initializeDatabase };
