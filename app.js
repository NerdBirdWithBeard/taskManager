const express = require('express')
const app = express()
const port = 3000

app.use((req, res, next) => {
    console.log(`${req.method.toUpperCase()} ${req.host}${req.url}`);
    next();
});

app.get('/api/status', (req, res) => {
    res.send('This is task status')
})

app.get('/api/hello', (req, res) => {
    res.send('Hello, my friend!')
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Internal server error`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
