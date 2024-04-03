const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog', // Assuming the name of your blog schema/model is 'Blog'
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mern_test', // Assuming the name of your user schema/model is 'mern_test'
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define collection name
const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
