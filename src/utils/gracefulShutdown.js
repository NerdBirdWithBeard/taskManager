const prisma = require('../lib/prisma');

async function gracefulShutdown(signal) {
    console.log(`${signal} received: closing Prisma client...`);
    await prisma.$disconnect();
    process.exit(0);
}

module.exports = gracefulShutdown;
