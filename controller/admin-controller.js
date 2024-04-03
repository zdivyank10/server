const Contact = require("../models/contact-model");
const User = require("../models/user-model")
const blog = require("../models/blog-model")
const declined = require("../models/declined-model");
const user = require("../models/user-model");
const like= require("../models/like-model");
const comment = require("../models/comment-model");
const contact = require("../models/contact-model");
// ----------------------------------
// ----------------------------------
// ***********all Users ***********
// ----------------------------------
// ----------------------------------
const getAllUsers = async (req, res) => {

    try {
        const users = await User.find({}, { password: 0 });
        console.log(users);
        if (!users || users.length === 0) {
            return res.status(400).json({ message: 'No user found' });
        }
        return res.status(200).json(users)
    } catch (error) {
        // next(error);
        console.log('error from admin Controller', error);
    }
}


// ----------------------------------
// ----------------------------------
// ***********all contact ***********
// ----------------------------------
// ----------------------------------

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        console.log(contacts);
        if (!contacts || contacts.length === 0) {
            return res.status(400).json({ message: 'No contacts found' });
        }
        return res.status(200).json(contacts);
    } catch (error) {
        console.log('error from admin Controller', error);
    }
}

// ----------------------------------
// ----------------------------------
// ***********Delete User***********
// ----------------------------------
// ----------------------------------

const deleteUserById = async (req, res) => {

    try {
        const id = req.params.id;
        // upper id == /:id vala id
        await User.deleteOne({ _id: id });
        // schema wala id
        return res.status(200).json({ message: 'User Deleted Successfully...' });
    } catch (error) {
        console.log('error from delete user', error);
        // next(error)
    }
}

// ----------------------------------
// ----------------------------------
// ***********Get userbyid User***********
// ----------------------------------
// ----------------------------------

const getUserById = async (req, res) => {

    try {
        const id = req.params.id;
        // upper id == /:id vala id
        const data = await User.findOne({ _id: id }, { password: 0 });
        // schema wala id
        return res.status(200).json(data);

    } catch (error) {
        console.log(error)
    }
}


const updateBlogPermission = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { permission } = req.body;

        if (!['true', 'false', 'pending'].includes(permission)) {
            return res.status(400).json({ error: 'Invalid permission state' });
        }

        // Find the blog document by ID and update the permission field
        const updatedBlog = await blog.findByIdAndUpdate(blogId, { permission }, { new: true });

        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog permission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    // console.log('hellp');
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone } = req.body;

        // Find the user by id and update its properties
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, phone }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        console.log('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
};

const editorsChoice = async (req, res) => {
    try {
        const { blogid, choice } = req.body;

        // Check if permission is true
        const blog_res = await blog.findById(blogid);
        if (!blog_res) {
            return res.status(404).json({ message: 'blog not found' });
        }
        
        // Assuming 'permission' is a field in your blog document
        if (blog_res.permission === "false") {
            return res.status(403).json({ message: 'Permission denied' });
        }

        // Update the document
        const edtrchoice = await blog.findByIdAndUpdate(blogid, { choice: choice }, { new: true }).populate('author_id', 'username');
        if (!edtrchoice) {
            return res.status(404).json({ message: 'blog not found' });
        }

        res.status(200).json({ message: 'Editor choice successfully added', edtrchoice });

    } catch (error) {
        console.log('Error getting Editors choice blogs', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const alreadyeditorsChoice = async (req, res) => {
    try {
    
        const alreadyedtrchoice = await blog.find( { choice: "true" }).populate('author_id', 'username');
        if (!alreadyedtrchoice) {
            return res.status(404).json({ message: 'blog not found' });
        }

        res.status(200).json(alreadyedtrchoice );

    } catch (error) {
        console.log('Error getting Editors choice blogs', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const monthlyUser = async (req, res) => {
    try {
        const results = await user.aggregate([
            {
                $project: {
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' }
                }
            },
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Send the results back to the client
        res.status(200).json(results);
    } catch (error) {
        console.log('Error getting monthly users:', error);
        // Send an error response to the client
        res.status(500).json({ message: 'Internal server error' });
    }
}

const blogstat = async (req,res)=>{
    try {
        // Count approved blogs
        const approvedCount = await blog.countDocuments({ permission: 'true' });
    
        // Count pending blogs
        const pendingCount = await blog.countDocuments({ permission: 'pending' });
    
        // Count declined blogs
        const declinedCount = await blog.countDocuments({ permission: 'false' });
    
        // Total number of blogs
        const totalCount = approvedCount + pendingCount + declinedCount;
    
        // Send the blog statistics as JSON response
        res.status(200).json({
          approved: approvedCount,
          pending: pendingCount,
          declined: declinedCount,
          total: totalCount
        });
      } catch (error) {
        console.error('Error fetching blog statistics:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    
    
}
const totalLike = async (req,res)=>{
    try {
        // Count approved blogs
        const totLike = await like.countDocuments({});
    
       
        res.status(200).json({
            TotalLike:totLike
        });
      } catch (error) {
        console.error('Error fetching Total Like:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    
    
}
const totalComment = async (req,res)=>{
    try {
        // Count approved blogs
        const totcmt = await comment.countDocuments({});
    
       
        res.status(200).json({
        totalCmt:totcmt
        });
      } catch (error) {
        console.error('Error fetching Total Like:', error);
        res.status(500).json({ message: 'Internal server error' });
      }  
}
const totalContact = async (req,res)=>{
    try {
        // Count approved blogs
        const totcontact = await contact.countDocuments({});
        res.status(200).json(totcontact);
      } catch (error) {
        console.error('Error fetching Total Like:', error);
        res.status(500).json({ message: 'Internal server error' });
      }  
}

const totalAdmin = async (req,res)=>{
    try {
        // Count approved blogs
        const totadmin = await user.find({isAdmin:"true"}).countDocuments({});
        res.status(200).json(totadmin);
      } catch (error) {
        console.error('Error fetching Total admin:', error);
        res.status(500).json({ message: 'Internal server error' });
      }  
}
const makeAdmin = async (req,res)=>{
    try {
        const {userid } =  req.params;
        // Count approved blogs
        const admin = await user.findByIdAndUpdate(userid, { isAdmin :true }, { new: true });
        res.status(200).json(admin);
      } catch (error) {
        console.error('Error fetching Total admin:', error);
        res.status(500).json({ message: 'Internal server error' });
      }  
}
const removeAdmin = async (req,res)=>{
    try {
        const {userid } =  req.params;
        // Count approved blogs
        const admin = await user.findByIdAndUpdate(userid, { isAdmin :false }, { new: true });
        res.status(200).json(admin);
      } catch (error) {
        console.error('Error fetching Total admin:', error);
        res.status(500).json({ message: 'Internal server error' });
      }  
}
module.exports = { getAllUsers, getAllContacts, deleteUserById, getUserById, updateBlogPermission,updateUser,editorsChoice,alreadyeditorsChoice,monthlyUser,blogstat,totalLike,totalComment,totalContact ,totalAdmin,makeAdmin,removeAdmin}