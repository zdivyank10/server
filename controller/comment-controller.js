const Comment = require('../models/comment-model');
// const comment = require('../models/comment-model');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const addcomment = async (req, res) => {
    try {
        const { blogid } = req.params;
        const { userid, content } = req.body;

        const newComment = new Comment({
            blogid, // Ensure blogid is correctly passed
            userid, // Ensure userid is correctly passed
            content, // Ensure content is correctly passed
        });
        await newComment.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });


    } catch (error) {
        console.log('error adding cmt', error)
    }
}


const getcomment = async (req, res) => {
    try {
        const { blogid } = req.params;
        console.log('Received comment id:', blogid);

        // Validate blogid format
        if (!ObjectId.isValid(blogid)) {
            return res.status(400).json({ message: 'Invalid Blog ID' });
        }

        // Find comment by blogid and populate the 'userid' field to get 'username'
        const response = await Comment.find({ blogid: ObjectId.createFromHexString(blogid) }).populate('userid', 'username');
        console.log(response);

        // Check if comment exists
        if (!response || response.length === 0) {
            // return res.status(404).json({ message: 'No Comment Found' });
            console.log('No Comment Found');
        }

        // Return comment
        return res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error getting comment:', error);
        // return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { _id, userid } = req.body;
        // if (req.user._id !== userid) {
        //     return res.status(403).json({ error: "You are not authorized to delete this comment" });
        // }
        await Comment.findOneAndDelete({ _id, userid });
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log('Error Deleting Comment', error);
    }
}

const countComment = async (req, res) => {
    try {
        const { blogid } = req.params;
        const commentCount = await Comment.countDocuments({ blogid: blogid });
        res.json({ count: commentCount });
        // res.json({ totalCount });
    } catch (error) {
        console.log('Error fething total Comment', error);
    }
}

module.exports = { addcomment, getcomment, deleteComment, countComment };