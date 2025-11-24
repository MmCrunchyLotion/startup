const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cookieParser());

// Logging middleware requests
app.use((req, res, next) => {
    console.log('\n--- New Request ---');
    console.log(req.method);
    console.log(req.originalUrl);
    console.log(req.body);
    console.log(req.cookies);
    console.log(users);
    console.log(posts);
    next();
});

// Built in middleware - Static file hosting
app.use(express.static('public'));

// Routing middleware


// Register account
app.post('/api/auth', async (req, res) => {
    if (await getUser('username', req.body.username)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.username, req.body.password);
        setAuthCookie(res, user);
        setUsernameCookie(res, user);
        res.send({ username: user.username });
    }
});


// Login account
app.put('/api/auth', async (req, res) => {
    const user = await getUser('username', req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        setAuthCookie(res, user);
        setUsernameCookie(res, user);
        res.send({ username: user.username });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Logout account
app.delete('/api/auth', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        clearAuthCookie(res, user);
        clearUsernameCookie(res, user);
    }
    res.send({});
});

// Get current user's and username
app.get('/api/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        res.send({ username: user.username });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Check username availability
app.get('/api/user/:username', async (req, res) => {
    if (await getUser('username', req.params.username)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        res.send({ msg: 'Username available' });
    }
});


// Get user profile
app.get('/api/user', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        console.log('Fetching profile for user:', user.username);
        res.send({
            accountType: user.accountType, 
            username: user.username, 
            email: user.email, 
            name: user.name, 
            bio: user.bio, 
            location: user.location
        });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Edit user profile
app.put('/api/user', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);

    if (user) {
        const updatedUser = await updateUser(user.username, req.body);
        res.send(updatedUser);
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Create a new post
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

// Get all posts
app.get('/api/posts', async (req, res) => {
    const posts = await getPosts();
    res.send(posts);
});

// In-memory "user database"
const users = [];

async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        accountType: 'User',
        username: username,
        password: passwordHash,
        email: null,
        name: null,
        bio: null,
        location: null,
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

async function updateUser(username, data) {
    const user = getUser('username', username);
    if (user) {
        Object.assign(user, data);
        return user;
    }
    return null;
}

function setAuthCookie(res, user) {
    user.token = uuid.v4();

    res.cookie('token', user.token, {
        secure: true,
        httpOnly: true,
        // sameSite: 'strict',
        sameSite: 'none',
    });
}

function clearAuthCookie(res, user) {
    delete user.token;
    res.clearCookie('token');
}

function setUsernameCookie(res, user) {
    res.cookie('username', user.username, {
        secure: true,
        // httpOnly: true,
        httpOnly: false,
        // sameSite: 'strict',
        sameSite: 'none',
    });
}

function clearUsernameCookie(res, user) {
    res.clearCookie('username');
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