const express = require('express');
const {blogs,blogform,approvedBlogs,notApprovedBlogs,pendingBlogs,getfullblog, getblogbyuserid, myapprovedblogs, mynotapprovedblogs, mypendingblogs,updateBlog,deleteBlog,searchBlog} = require('../controller/blog-controller');

const authMiddleware = require('../middlewares/auth-middleware');
// const validate = require('../middlewares/validate-middleware');

// const {addBlogSchema} =require('../validators/auth-validator')

const router = express.Router();

router.route('/blog').get(blogs);

router.route('/addblog').post(blogform);


router.route("/approvedblog").get(approvedBlogs);
router.route("/notapprovedblog").get(notApprovedBlogs);
router.route("/pendingblog").get(pendingBlogs);

// router.route("/approvedblog/:id").get(getfullblog);

router.route("/blog/:id").get(getfullblog);

// got user blog by id
router.route("/:id").get(getblogbyuserid);
router.route("/:id/approved").get(myapprovedblogs);
router.route("/:id/notapproved").get(mynotapprovedblogs);
router.route("/:id/pending").get(mypendingblogs);
router.route("/:id/update").put(updateBlog);
router.route("/:id/delete").delete(deleteBlog);

router.route("/search").post(searchBlog);



module.exports = router;