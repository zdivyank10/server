const mongoose = require('mongoose');

const comment_schema = new mongoose.Schema({
    blogid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
   userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mern_test1', 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] } 
})

const Comment = mongoose.model('comment',comment_schema);

module.exports = Comment;