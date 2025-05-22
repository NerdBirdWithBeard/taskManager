const { PrismaClient, Prisma } = require('@prisma/client');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

function normalizeResult(result) {
    if (
        result === null ||
        (typeof result === 'object' && (
        (Array.isArray(result) && result.length === 0) ||
        (Object.keys(result).length === 0 && result.constructor === Object)
        ))
    ) {
        return null;
    }
    return result;
}

function sendNormalized(res, result, successMessage, fallbackStatus = 400, fallbackMessage = 'Invalid data') {
    result = normalizeResult(result);

    if (result) {
        res.json({ message: successMessage, result });
    } else {
        res.status(fallbackStatus).json({ error: fallbackMessage });
    }
}

function generateToken(userId) {
  return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

async function createUser(data) {
    const user = await prisma.user.create({data: data});
    return user;
}

async function getUser(filter) {
    const user = await prisma.user.findUnique({where: filter});
    return user;
}

async function createProject(data) {
    const project = await prisma.project.create({data: data});
    return project;
}

async function createTask(data) {
    const task = await prisma.task.create({data: data});
    return task;
}

async function updateTask(filter, data) {
    const task = await prisma.task.update({
        where: filter,
        data: data
    });
    return task;
}

async function getTask(filter) {
    const task = await prisma.task.findUnique({where: filter});
    return task;
}

async function getTasks(filter) {
    const task =  await prisma.task.findMany({where: filter});
    return task;
}

async function deleteTask(filter) {
    const task = await prisma.task.delete({where: filter});
    return task;
}

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({message: 'Invalid token'})
    }
};

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method.toUpperCase()} ${req.host}${req.url}`);
    next();
});

app.post('/api/auth/register', asyncHandler(async (req, res) => {
        const data = req.body;
            data.password = await bcrypt.hash(data.password, 10);
            let user = await createUser(data);
            const token = generateToken(user.id);
            sendNormalized(res, {accessToken: token}, 'New user successfully created');
    }));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }
    console.log(email, password);
    user = await getUser({email: email});
    if (!user) {
        return res.status(401).json({error: 'Invalid credentials'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    let result = isMatch
        ? {accessToken: generateToken(user.id)}
        : null;
    sendNormalized(res, result, 'Authorized', 401, 'Unauthorized');
}));

app.post('/api/createProject', auth, asyncHandler(async (req, res) => {
    const data = req.body;
    data.ownerId = req.user.userId;
    sendNormalized(res, await createProject(data), 'New project successfully created');
}));

app.get('/api/tasks', auth, asyncHandler(async (req, res) => {
    const filter = req.query;
    filter.userId = req.user.userId;
    sendNormalized(res, await getTasks(filter), 'Success', 404, 'No tasks found found');
}));

app.route('/api/task')
    .get(auth ,asyncHandler(async (req, res) => {
        const filter = req.query;
        filter.userId = req.user.userId;
        sendNormalized(res, await getTask(filter), 'Success', 404, 'Task not found');

    }))
    .post(auth, asyncHandler(async (req, res) => {
        const { id } = req.query;
        const filter = req.query;
        const data = req.body;
        data.dueDate = new Date(data.dueDate);
        data.userId = req.user.userId;
        if (id) {
            sendNormalized(res,
                await updateTask(filter, data),
                'Task successfully updated',
                404,
                'Task not found for update'
            );
        }
        else {
            sendNormalized(res, await createTask(data), 'New task successfully created');
        }
    }))
    .delete(auth, asyncHandler(async (req, res) => {
        const { id } = req.query;
        const filter = req.query;
        filter.userId = req.user.userId;
        if (id) {
            sendNormalized(res, await deleteTask(filter), 'Task successfully deleted',
                404,
                'Task not found'
            );
        } else {
            res.status(400).json({message: 'Nothing to delete'})
        }
    }));

app.use((err, req, res, next) => {
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
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

process.on('SIGINT', async () => {
    console.log('SIGINT received: closing Prisma client...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received: closing Prisma client...');
    await prisma.$disconnect();
    process.exit(0);
});