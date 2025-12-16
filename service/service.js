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
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Email already registered' });
    } else {
        const user = await createUser(req.body.email, req.body.password);
        setAuthCookie(res, user);
        res.send({ email: user.email });
    }
});

// Also accept POST /auth for compatibility with frontend requests
apiRouter.post('/auth', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        return res.status(409).send({ msg: 'Email already registered' });
    }
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user);
    return res.send({ email: user.email });
});

// (Login) getAuth for provided user
apiRouter.put('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        const newToken = uuid.v4();
        if (!user.tokens) user.tokens = [];
        user.tokens.push(newToken);
        await DB.updateUser(user);
        setAuthCookie(res, { ...user, token: newToken });
        return res.send({ email: user.email });
    }
    return res.status(401).send({ msg: 'Unauthorized' });
});

// Accept PUT /auth as login for compatibility with frontend
apiRouter.put('/auth', async (req, res) => {
    const user = await findUser('email', req.body.email);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        const newToken = uuid.v4();
        if (!user.tokens) user.tokens = [];
        user.tokens.push(newToken);
        await DB.updateUser(user);
        setAuthCookie(res, { ...user, token: newToken });
        return res.send({ email: user.email });
    }
    return res.status(401).send({ msg: 'Unauthorized' });
});

// (Logout) deleteAuth token if stored in cookie
apiRouter.delete('/auth', async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await findUser('token', token);
    if (user) {
        if (user.tokens && Array.isArray(user.tokens)) {
            // Remove only the current token from the array
            user.tokens = user.tokens.filter(t => t !== token);
        }
        await DB.updateUser(user);
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

// Check email availability
// TODO: update to match external DB structure
apiRouter.get('/user/:email', async (req, res) => {
    if (await findUser('email', req.params.email)) {
        res.status(409).send({ msg: 'Email already registered' });
    } else {
        res.send({ msg: 'Email available' });
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
        // If trying to change username, check if new username already exists
        if (req.body.username && req.body.username !== user.username) {
            if (await findUser('username', req.body.username)) {
                return res.status(409).send({ msg: 'Username already taken' });
            }
        }
        // Build update object with only editable fields
        const updateFields = {};
        if (req.body.username !== undefined) updateFields.username = req.body.username;
        if (req.body.name !== undefined) updateFields.name = req.body.name;
        if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
        if (req.body.zipcode !== undefined) updateFields.zipcode = req.body.zipcode;
        
        // Update the user with only the editable fields
        const updatedUser = await DB.updateUser({ email: user.email, ...updateFields });
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

async function createUser(email, password) {
    console.log('Creating user with email:', email);
    const passwordHash = await bcrypt.hash(password, 10);
    const newToken = uuid.v4();
    const user = {
        accountType: 'User',
        email: email,
        password: passwordHash,
        tokens: [newToken],
        username: null,
        name: null,
        bio: null,
        zipcode: null,
    };
    console.log('User object before DB insert:', user);
    await DB.addUser(user);
    console.log('User created successfully in DB');
    // Return user with token property for compatibility
    return { ...user, token: newToken };
}

async function findUser(field, value) {
  if (!value) return null;
  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  if (field === 'email') {
    return DB.getUserByEmail(value);
  }
  if (field === 'username') {
    return DB.getUserByUsername(value);
  }
  return null;
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
    // Get the token from the user object (used during login/registration)
    // or from the last token in the tokens array (most recently created)
    const token = user.token || (user.tokens && user.tokens[user.tokens.length - 1]);
    if (!token) {
        throw new Error('No token available for user');
    }
    res.cookie(authCookieName, token, {
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
    // MongoDB automatically assigns _id
    if (res && res.insertedId) post._id = res.insertedId;
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
