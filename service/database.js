const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('match_your_music');
const userCollection = db.collection('users');
const postCollection = db.collection('posts');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connect to database`);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
})();

function getUser(email) {
    return userCollection.findOne({ email: email });
}

function getUserByUsername(username) {
    return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function addUser(user) {
    await userCollection.insertOne(user);
}

async function updateUser(user) {
    // Prefer updating by username if available, otherwise fall back to email
    if (user.username) {
        await userCollection.updateOne({ username: user.username }, { $set: user });
    } else if (user.email) {
        await userCollection.updateOne({ email: user.email }, { $set: user });
    } else {
        throw new Error('updateUser requires username or email');
    }
}

async function createPost(post) {
    return postCollection.insertOne(post);
}

// TODO: limit the size of entries that this fetches so that DB isn't overloaded each time this is called
async function getPosts() {
    return postCollection.find({}).toArray();
}

module.exports = {
    getUser,
    getUserByUsername,
    getUserByToken,
    addUser,
    updateUser,
    createPost,
    getPosts
};