const express = require('express');
const router = express.Router();
const commentController = require('../controller/comment-controller');
// const authMiddleware = require('../middlewares/auth-middleware');
const {CommentSchema} = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");


router.route('/:blogid/comment').post(validate(CommentSchema), commentController.addcomment);

router.route('/:blogid').get(commentController.getcomment);

router.route('/:blogid/count').get(commentController.countComment);

router.route('/:blogid/delete').delete(commentController.deleteComment);

module.exports = router;
