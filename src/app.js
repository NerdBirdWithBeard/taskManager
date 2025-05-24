const express = require('express');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const tasksRoutes = require('./routes/tasks.routes');
const projectRoutes = require('./routes/project.routes');
const uploadRoutes = require('./routes/upload.routes');

const auth = require('./middleware/auth');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

module.exports = app;
