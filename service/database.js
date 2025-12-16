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

function getUserByEmail(email) {
    return userCollection.findOne({ email: email });
}

function getUserByUsername(username) {
    return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
    return userCollection.findOne({ tokens: token });
}

async function addUser(user) {
    await userCollection.insertOne(user);
}

  async function updateUser(updateData) {
    // Use email as the primary lookup field since it's immutable
    if (updateData.email) {
        // Use $set to update only the provided fields
        const setData = {};
        Object.keys(updateData).forEach(key => {
            if (key !== 'email' && key !== '_id') {
                setData[key] = updateData[key];
            }
        });
        
        await userCollection.updateOne({ email: updateData.email }, { $set: setData });
        return await userCollection.findOne({ email: updateData.email });
    } else {
        throw new Error('updateUser requires email');
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
    getUserByEmail,
    getUserByUsername,
    getUserByToken,
    addUser,
    updateUser,
    createPost,
    getPosts
};