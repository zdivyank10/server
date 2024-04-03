const express = require('express');
const router = express.Router();
const likeController = require('../controller/like-controller');

// Toggle like status for a blog post
router.post('/', likeController.like);
router.post('/:blog_id/like', likeController.bloglike);
// router.delete('/unlike', likeController.unlike);
router.post('/totallike', likeController.likeOfblog);
router.get('/:user/liked', likeController.user_likedBlogs);
router.get('/:blog_id/:user/liked', likeController.user_likedblog);
router.get('/popular', likeController.popularBlogs);
// .
module.exports = router;
 