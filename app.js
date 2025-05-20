const { PrismaClient, Prisma } = require('@prisma/client');
const express = require('express');
const app = express();
const port = 3000;
const prisma = new PrismaClient();

function convertDateFields(obj) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            const parsedDate = new Date(value);
            if (!isNaN(parsedDate)) {
                result[key] = parsedDate;
                continue;
            }
        }
        result[key] = value;
    }

    return result;
}

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

async function createUser(data) {
    const user = await prisma.user.create({data: data});
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

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method.toUpperCase()} ${req.host}${req.url}`);
    next();
});

app.post('/api/createUser', asyncHandler(async (req, res) => {
    const data = req.body;
    sendNormalized(res, await createUser(data), 'New user successfully created');
}));

app.post('/api/createProject', asyncHandler(async (req, res) => {
    const data = req.body;
    sendNormalized(res, await createProject(data), 'New project successfully created');
}));

app.get('/api/tasks', asyncHandler(async (req, res) => {
    const filter = req.query;
        let result;
        if (Object.keys(filter).length === 0) {
            result = await getTasks();
            } else {
            result = await getTasks(filter);
        }
        sendNormalized(res, result, 'Success', 404, 'No tasks found found');
}));

app.route('/api/task')
    .get(asyncHandler(async (req, res) => {
        const filter = req.query;
        sendNormalized(res, await getTask(filter), 'Success', 404, 'Task not found');

    }))
    .post(asyncHandler(async (req, res) => {
        const { id } = req.query;
        const filter = req.query;
        const data = convertDateFields(req.body);
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
    .delete(asyncHandler(async (req, res) => {
        const { id } = req.query;
        const filter = req.query;
        if (id) {
            sendNormalized(res, await deleteTask(filter), 'Task successfully deleted',
                404,
                'Task not found'
            );
        } else {
            res.status(400).json({message: 'Nothing to delete'})
        }
    }))

app.get('/api/status', (req, res) => {
    res.send('This is task status')
})

app.get('/api/hello', (req, res) => {
    res.send('Hello, my friend!')
})

app.use((err, req, res, next) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return res.status(409).json({
                    error: `Record with such field value "${err.meta?.target}" already exists`,
                });
            }
        }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
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
