// likeController.js

const blog = require('../models/blog-model'); // Import the Blog model
const Like = require('../models/like-model'); // Import the Blog model

// Controller function for liking a blog post
const like = async (req, res) => {
  const { user, blog } = req.body;

  try {
    const existingLike = await Like.findOne({ user, blog });
    if (existingLike) {
      // User already liked the blog, so unlike it
      await Like.deleteOne({ _id: existingLike._id });
      res.json({ success: true, message: 'Blog unliked successfully' });
    } else {
      // User hasn't liked the blog, so like it
      const newLike = new Like({ user, blog });
      await newLike.save();
      res.json({ success: true, message: 'Blog liked successfully' });
    }
  } catch (error) {
    console.error('Error doing like', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
  const user_likedBlogs =async(req,res)=>{

  const user = req.params.user;
  try {
    if (!user) {
      console.log('User not loggedin');
    }
    // Find all likes where user is the specified userId
    const likedPosts = await Like.find({ user: user }).select('blog');
    res.json(likedPosts);
  } catch (error) {
    // console.error('Error fetching liked posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const likeOfblog = async (req, res) => {
  const { blog } = req.body;

  try {
    // Find the total number of likes for the given blog
    // const totalLikes = await Like.find({ blog: blog }).countDocuments();
    const totalLikes = await Like.countDocuments({ blog });

    res.status(200).json({ totalLikes });
  } catch (error) {
    console.log('Error fetching total likes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const bloglike = async (req, res) => {
  const { user} = req.body;
  const {blog_id}= req.params;

  try {
    const existingLike = await Like.findOne({ user:user, blog:blog_id });
    if (existingLike) {
      // User already liked the blog, so unlike it
      await Like.deleteOne({ _id: existingLike._id });
      res.json({ success: true, message: 'Blog unliked successfully' });
    } else {
      // User hasn't liked the blog, so like it
      const newLike = new Like({ user, blog });
      await newLike.save();
      res.json({ success: true, message: 'Blog liked successfully' });
    }
  } catch (error) {
    console.error('Error doing like', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const user_likedblog = async (req, res) => {
  const { user, blog_id } = req.params;
  try {
    // Check if there's any like with the specified user and blog_id
    const likedPost = await Like.findOne({ user: user, blog: blog_id });

    // If likedPost exists, user has liked the post, otherwise not liked
    const isLiked = !!likedPost;
    
    res.json({ isLiked });
  } catch (error) {
    console.error('Error checking liked post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// const popularBlogs = async (req, res) => {
//   try {
//     // Aggregate likes to count the number of likes for each blog
//     const popularLikes = await Like.aggregate([
//       {
//         $group: {
//           _id: '$blog',
//           totalLikes: { $sum: 1 }
//         }
//       },
//       {
//         $sort: { totalLikes: 1 } // Sort by the total number of likes in ascending order
//       },
//       {
//         $limit: 10 // Limit the result to 10 records
//       }
//     ]);

//     // Extract the blog IDs from the aggregated data
//     const blogIds = popularLikes.map(like => like._id);

//     // Fetch the blog data using the extracted blog IDs
//     const blogs = await blog.find({ _id: { $in: blogIds } }).populate('author_id', 'username');

//     res.json(blogs);
//   } catch (error) {
//     console.error('Error fetching popular blogs:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

const popularBlogs = async (req, res) => {
  try {
      // Aggregate likes to count the number of likes for each blog
      const popularLikes = await Like.aggregate([
          {
              $group: {
                  _id: '$blog',
                  totalLikes: { $sum: 1 }
              }
          },
          {
              $sort: { totalLikes: -1 } // Sort by the total number of likes in descending order
          },
          {
              $limit: 10 // Limit the result to 10 records
          }
      ]);

      // Extract the blog IDs from the aggregated data
      const blogIds = popularLikes.map(like => like._id);

      // Fetch the blog data using the extracted blog IDs and where permission is true
      const blogs = await blog.find({ _id: { $in: blogIds }, permission: true }).populate('author_id', 'username');

      res.status(200).json(blogs);
  } catch (error) {
      console.error('Error fetching popular blogs:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  like,likeOfblog,user_likedBlogs,bloglike,user_likedblog,popularBlogs
};
