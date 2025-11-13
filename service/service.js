const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cookieParser());

// Logging middleware requests
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.originalUrl);
    console.log(req.body);
    console.log(req.cookies);
    console.log(users);
    next();
});

// Built in middleware - Static file hosting
app.use(express.static('public'));

// Routing middleware

app.post('/api/auth', async (req, res) => {
    if (await getUser('username', req.body.username)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.username, req.body.password);
        setAuthCookie(res, user);
        res.send({ username: user.username });
    }
});

app.put('/api/auth', async (req, res) => {
    const user = await getUser('username', req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        setAuthCookie(res, user);
        res.send({ username: user.username });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

app.delete('/api/auth', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        clearAuthCookie(res, user);
    }
    res.send({});
});

app.get('/api/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        res.send({ username: user.username });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

app.post('/api/posts', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        // Handle creating a post here
        console.log('Creating post for user:', user.username);
        const post = await createPost(user.username, req.body);
        res.send(post);
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

app.get('/api/posts', async (req, res) => {
    const posts = await getPosts();
    res.send(posts);
});

// In-memory "user database"
const users = [];

async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        username: username,
        password: passwordHash,
    };
    users.push(user);
    return user;
}

function getUser(field, value) {
    if (value) {
        return users.find((user) => user[field] === value);
    }
    return null;
}

function setAuthCookie(res, user) {
    user.token = uuid.v4();

    res.cookie('token', user.token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

// function searchTeachers(method, data) {
    
//     console.log(`Searching teachers with method: ${method} and data:`, data);
// }

function clearAuthCookie(res, user) {
    delete user.token;
    res.clearCookie('token');
}

// In-memory "post database"
const posts = [];

async function createPost(username, data) {
    // Defensive check: ensure data is an object
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid post data: expected an object');
    }

    const post = {
        id: uuid.v4(),
        username: username,
        type: data.type,
        title: data.title,
        content: data.content,
        eventDate: data.eventDate,
        time: data.eventTime,
        location: data.location,
        timestamp: new Date().toISOString(),
    };
    posts.push(post);
    return post;
}

async function getPosts() {
    return posts;
}

// Starting backend service
const port = 8080;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
module.exports = app;