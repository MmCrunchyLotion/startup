const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const DB = require('./database.js');
const uuid = require('uuid');
const path = require('path');

// In-memory "post database" (declare early so middleware can reference if needed)
const posts = [];

const app = express();

const authCookieName = 'token';
// const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Logging middleware requests
app.use((req, res, next) => {
    console.log('\n--- New Request ---');
    console.log(req.method);
    console.log(req.originalUrl);
    console.log(req.body);
    console.log(req.cookies);
    next();
});

// Built in middleware - Static file hosting
// Serve static from the repository public folder (one level up from service/)
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// (Register) CreateAuth for new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('username', req.body.username)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.username, req.body.password);
        setAuthCookie(res, user);
        // setUsernameCookie(res, user); // Maybe not needed
        res.send({ username: user.username });
    }
});

// Also accept POST /auth for compatibility with frontend requests
apiRouter.post('/auth', async (req, res) => {
    if (await findUser('username', req.body.username)) {
        return res.status(409).send({ msg: 'Existing user' });
    }
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user);
    return res.send({ username: user.username });
});

// (Login) getAuth for provided user
apiRouter.put('/auth/login', async (req, res) => {
    const user = await findUser('username', req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        user.token = uuid.v4();
        await DB.updateUser(user);
        setAuthCookie(res, user);
        // setUsernameCookie(res, user); // Maybe not needed
        return res.send({ username: user.username });
    }
    return res.status(401).send({ msg: 'Unauthorized' });
});

// Accept PUT /auth as login for compatibility with frontend
apiRouter.put('/auth', async (req, res) => {
    const user = await findUser('username', req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        user.token = uuid.v4();
        await DB.updateUser(user);
        setAuthCookie(res, user);
        return res.send({ username: user.username });
    }
    return res.status(401).send({ msg: 'Unauthorized' });
});

// (Logout) deleteAuth token if stored in cookie
apiRouter.delete('/auth', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
         await DB.updateUser(user);
        // clearUsernameCookie(res, user); // Maybe not needed
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// Get current user's and username
// TODO: update to match external DB structure
apiRouter.get('/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await findUser('token', token);
    if (user) {
        res.send({ username: user.username });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Check username availability
// TODO: update to match external DB structure
apiRouter.get('/user/:username', async (req, res) => {
    if (await findUser('username', req.params.username)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        res.send({ msg: 'Username available' });
    }
});


// Get user profile
// TODO: update to match external DB structure
apiRouter.get('/user', async (req, res) => {
    const token = req.cookies['token'];
    const user = await findUser('token', token);
    if (user) {
        console.log('Fetching profile for user:', user.username);
        res.send({
            accountType: user.accountType, 
            username: user.username, 
            email: user.email, 
            name: user.name, 
            bio: user.bio, 
            zipcode: user.zipcode
        });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Edit user profile
// TODO: update to match external DB structure
apiRouter.put('/user', async (req, res) => {
    const token = req.cookies['token'];
    const user = await findUser('token', token);

    if (user) {
        const updatedUser = await updateUser(user.username, req.body);
        res.send(updatedUser);
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Create a new post
// TODO: update to match external DB structure
apiRouter.post('/posts', async (req, res) => {
    const token = req.cookies['token'];
    const user = await findUser('token', token);
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
// TODO: update to match external DB structure
apiRouter.get('/posts', async (req, res) => {
    const posts = await getPosts();
    res.send(posts);
});

// TODO: update to match external DB structure
apiRouter.get('/posts/nearby', async (req, res) => {
    const userLat = parseFloat(req.query.lat);
    const userLon = parseFloat(req.query.lon);
    const radiusKm = parseFloat(req.query.radius) || 25; // Default radius 25 km
    const results = await eventRadiusSearch(userLat, userLon, radiusKm);
    res.send(results);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    // index.html is at project root; serve that file so SPA routes work
    const indexPath = path.join(__dirname, '..', 'index.html');
    res.sendFile(indexPath);
});

async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        accountType: 'User',
        username: username,
        password: passwordHash,
        token: uuid.v4(),
        email: null,
        name: null,
        bio: null,
        zipcode: null,
    };
    await DB.addUser(user);
    return user;
}

async function findUser(field, value) {
  if (!value) return null;
  if (field === 'token') {
    return DB.getUserByToken(value);
  }
    if (field === 'username') {
        return DB.getUserByUsername(value);
    }
    // fallback: try by email
    return DB.getUser(value);
}


// TODO: update to match external DB structure
async function updateUser(username, data) {
    const user = findUser('username', username);
    if (user) {
        Object.assign(user, data);
        return user;
    }
    return null;
}

// THIS IS A MINIMAL cookie setter for auth (dev-friendly)
function setAuthCookie(res, user) {
    // Ensure user has a token
    if (!user.token) user.token = uuid.v4();
    res.cookie(authCookieName, user.token, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        // For local development avoid secure:true because it requires HTTPS.
        secure: false,
        sameSite: 'lax',
    });
}

// function clearAuthCookie(res, user) {
//     delete user.token;
//     res.clearCookie('token');
// }

// function setUsernameCookie(res, user) {
//     res.cookie('username', user.username, {
//         secure: true,
//         // httpOnly: true,
//         httpOnly: false,
//         // sameSite: 'strict',
//         sameSite: 'none',
//     });
// }

// function clearUsernameCookie(res, user) {
//     res.clearCookie('username');
// }
// // setAuthCookie in the HTTP response
// function setAuthCookie(res, authToken) {
//     res.cookie(authCookieName, authToken, {
//         maxAge: 1000 * 60 * 60 * 24 * 365,
//         secure: true,
//         httpOnly: true,
//         // sameSite: 'strict',
//         sameSite: 'none',
//     });
// }

async function createPost(username, data) {
    // Defensive check: ensure data is an object
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid post data: expected an object');
    }

    const post = {
        username: username,
        type: data.type,
        title: data.title,
        content: data.content,
        eventDate: data.eventDate,
        time: data.eventTime,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date().toISOString(),
    };
    // Persist to external DB
    const res = await DB.createPost(post);
    // Mongo returns insertedId; attach it as id for compatibility
    if (res && res.insertedId) post.id = res.insertedId;
    return post;
}

async function getPosts() {
    // Read from external DB
    return await DB.getPosts();
}

async function eventRadiusSearch(userLat, userLon, radiusKm) {
    const results = [];
    const allPosts = await DB.getPosts();
    for (const post of allPosts) {
        if (post.type !== 'event') continue;
        const distance = haversine(userLat, userLon, post.latitude, post.longitude);
        if (distance <= radiusKm) {
            console.log(`Post ${post._id || post.id} is within ${radiusKm} km: ${distance.toFixed(2)} km`);
            results.push(post);
        }
    }
    return results;
}

// Starting backend service
const port = 8080;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
module.exports = app;

// Haversine formula to calculate distance between two lat/lon points
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
