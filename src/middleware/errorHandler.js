const { Prisma } = require('@prisma/client');

function errorHandler (err, req, res, next) { 
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return res.status(409).json({
                    error: `Record with such field value "${err.meta?.target}" already exists`,
                });
            }
            if (err.code === 'P2025') {
                return res.status(404).json({
                    error: 'Record not found. Nothing was deleted or updated.',
                });
            }
        }

    if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                    error: `Request validation error Prisma: "${err.message}"`,
                });
        }

    console.error(err.stack);
    res.status(500).json({error:'Internal Server Error'});
}

module.exports = errorHandler;
