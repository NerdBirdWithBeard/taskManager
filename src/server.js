const app = require('./app');
const gracefulShutdown = require('./utils/gracefulShutdown');
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
