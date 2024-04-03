const mongoose = require('mongoose');

// Define schema for declined blogs
const declinedBlogSchema = new mongoose.Schema({
    originalBlog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog', // Reference to the 'blog' model
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create model from schema
const DeclinedBlog = mongoose.model('DeclinedBlog', declinedBlogSchema);

module.exports = DeclinedBlog;
