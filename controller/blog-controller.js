const blog = require('../models/blog-model')

const blogs = async (req, res) => {
    try {
        const response = await blog.find().populate('author_id', 'username');;

        if (!response) {

            res.status(404).json({ message: 'No data Found' })
        }
        res.status(200).json({ message: response })


    } catch (error) {
        res.status(500).json({ message: 'Message Not Displaying Successfully ' })
    }
}
const blogform = async (req, res) => {
    try {
        // Extract data from request body
        const { title, author_id, content, tags, cover_img } = req.body;

        const newBlog = await blog.create({
            title,
            author_id,
            content,
            tags,
            cover_img,
        });

        // console.log("req of img",req.file.filename)
        // console.log("path of img",cover_img_path)
        console.log('Blog posted successfully:', newBlog);
        res.status(200).json({ message: 'Blog posted successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Failed to create blog post' });
    }
}


const approvedBlogs = async (req, res) => {
    try {

        //   const approvedBlog = await blog.find({ permission: true });
        const approvedBlog = await blog.find({ permission: true })
            .populate('author_id', 'username');

        res.json(approvedBlog);
    } catch (error) {
        console.error('Error getting blog permission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const notApprovedBlogs = async (req, res) => {
    try {

        //   const approvedBlog = await blog.find({ permission: true });
        const notapprovedBlog = await blog.find({ permission: false })
            .populate('author_id', 'username');

        res.json(notapprovedBlog);
    } catch (error) {
        console.error('Error getting blog permission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const pendingBlogs = async (req, res) => {
    try {

        //   const approvedBlog = await blog.find({ permission: true });
        const pendingBlog = await blog.find({ permission: "pending" })
            .populate('author_id', 'username');

        res.json(pendingBlog);
    } catch (error) {
        console.error('Error getting blog permission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getfullblog = async (req, res) => {
    try {
        const { id } = req.params; // Ensure that id is correctly received from the frontend
        console.log('Received id:', id); // Log received id
        // Fetch the blog post using the id parameter
        const blogPost = await blog.findById(id).populate('author_id', 'username');
        console.log('Full Blog Post:', blogPost); // Log the fetched blog post
        if (!blogPost) {
            console.log('Blog post not found for id:', id);
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(blogPost);
        console.log('eachblog', blogPost);
    } catch (error) {
        console.error('Error fetching full blog post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
//userbyid
const getblogbyuserid = async (req, res) => {

    const { id } = req.params;
    console.log('userid', id);

    try {
        const blogPostbyuid = await blog.find({ author_id: id }).populate('author_id', 'username');;
        console.log('Full Blog Post By id:', blogPostbyuid);

        res.json(blogPostbyuid);

    } catch (error) {
        console.log('Error getting blog by id', error);
    }
}
const myapprovedblogs = async (req, res) => {

    const { id } = req.params;
    console.log('userid', id);

    try {
        const blogPostbyuid = await blog.find({ author_id: id, permission: true }).populate('author_id', 'username');;
        console.log('Full approved Blog Post By id:', blogPostbyuid);

        res.json(blogPostbyuid);

    } catch (error) {
        console.log('Error getting blog by id', error);
    }
}
const mynotapprovedblogs = async (req, res) => {

    const { id } = req.params;
    console.log('userid', id);

    try {
        const blogPostbyuid = await blog.find({ author_id: id, permission: false }).populate('author_id', 'username');;
        console.log('Full approved Blog Post By id:', blogPostbyuid);

        res.json(blogPostbyuid);

    } catch (error) {
        console.log('Error getting blog by id', error);
    }
}
const mypendingblogs = async (req, res) => {

    const { id } = req.params;
    console.log('userid', id);

    try {
        const blogPostbyuid = await blog.find({ author_id: id, permission: 'pending' }).populate('author_id', 'username');
        console.log('Full approved Blog Post By id:', blogPostbyuid);

        res.json(blogPostbyuid);

    } catch (error) {
        console.log('Error getting blog by id', error);
    }
}

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, cover_img, content, tags } = req.body;

    try {
        const updatedBlog = await blog.findByIdAndUpdate(id, { title, cover_img, content, tags, permission: 'pending' }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog updated successfully', updatedBlog });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBlog = await blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog Deleted successfully', deleteBlog });

    } catch (error) {
        console.error('Error Deleting Post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const searchBlog = async (req, res) => {
    try {
        const { query } = req.query;

        // Perform search using MongoDB's text search feature
        const searchResults = await blog.find({
            $or: [
                // { 'author_id.username': { $regex: query, $options: 'i' } } ,
                { 'author_id.username': { $regex: query, $options: 'i' } },

                { tags: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },

            ]
        }).populate('author_id', 'username');

        res.json(searchResults);
    } catch (error) {
        console.log('Error getting searched blogs', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




module.exports = { blogs, blogform, approvedBlogs, notApprovedBlogs, pendingBlogs, getfullblog, getblogbyuserid, myapprovedblogs, mynotapprovedblogs, mypendingblogs, updateBlog, deleteBlog, searchBlog }