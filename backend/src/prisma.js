const { PrismaClient } = require('@prisma/client');

let prismaInstance;

/**
 * Get or create the singleton PrismaClient instance.
 * @param {object} [options] - Custom options for PrismaClient (e.g. datasourceUrl for tests)
 * @returns {PrismaClient}
 */
function getPrismaClient(options = {}) {
  if (!prismaInstance || options.datasources) {
    prismaInstance = new PrismaClient(options);
  }
  return prismaInstance;
}

module.exports = {
  PrismaClient,
  getPrismaClient,
  prisma: getPrismaClient(),
};

