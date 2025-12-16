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

async function deletePost(postId, username) {
    // Only allow deleting own posts
    const { ObjectId } = require('mongodb');
    const result = await postCollection.deleteOne({ 
        _id: new ObjectId(postId),
        username: username
    });
    return result.deletedCount > 0;
}

// TODO: limit the size of entries that this fetches so that DB isn't overloaded each time this is called
async function getPosts() {
    return postCollection.find({}).toArray();
}

async function addComment(postId, comment) {
    const { ObjectId } = require('mongodb');
    // Generate a unique ID for the comment
    comment._id = new ObjectId();
    const result = await postCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: comment } }
    );
    if (result.modifiedCount > 0) {
        return comment;
    }
    return null;
}

async function getComments(postId) {
    const { ObjectId } = require('mongodb');
    const post = await postCollection.findOne({ _id: new ObjectId(postId) });
    return post?.comments || [];
}

async function deleteComment(postId, commentId, userEmail) {
    const { ObjectId } = require('mongodb');
    // First verify the user owns this comment
    const post = await postCollection.findOne({ 
        _id: new ObjectId(postId),
        'comments._id': new ObjectId(commentId),
        'comments.email': userEmail
    });
    
    if (!post) {
        return false;
    }
    
    const result = await postCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );
    return result.modifiedCount > 0;
}

module.exports = {
    getUser,
    getUserByEmail,
    getUserByUsername,
    getUserByToken,
    addUser,
    updateUser,
    createPost,
    deletePost,
    getPosts,
    addComment,
    getComments,
    deleteComment
};