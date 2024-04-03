const { ObjectId } = require('bson');
const  mongoose = require('mongoose');
const { string, boolean } = require('zod');

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author_id: { type: String ,ref: 'mern_test1' },
        // author: { type: ObjectId, ref: 'Author' }
        cover_img: { type: String },
        content: { type: String, required: true },
        tags: { type: [String], required: true },
        permission: {type: String,required: true,default: 'pending' },
        choice: {type: Boolean,required: true,default: 'false' },
        // permission: { type: Boolean, default:false ,required: true },
        // createdAt:{type: [String], required: true,default:()=> new Date(),}
        // createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] } 
        createdAt: {
            type: Date,
            default: Date.now,
        }
        

    }
)
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
const blog = mongoose.model('blog', blogSchema );

module.exports =  blog