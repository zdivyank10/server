require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const authRouter = require("./router/auth-router");
const contactRouter = require("./router/contact-router");
const adminRouter = require("./router/admin-router");
const blogRouter = require("./router/blog-router");
const likeRoutes = require("./router/like-router");
const commentRoutes = require("./router/comment-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const path = require("path");
const blog = require('./models/blog-model')
const multer = require('multer')
const cloudinary = require('cloudinary');
const { CLOUD_NAME, API_KEY, API_SECRET } = require("./config")
const fs = require('fs');
let streamifier = require('streamifier');

connectDb();

// fs.mkdirParent = function (dirPath, mode, callback) {
//   //Call the standard fs.mkdir
//   fs.mkdir(dirPath, mode, function (error) {
//     //When it fail in this way, do the custom steps
//     if (error && error.errno === 34) {
//       //Create all the parents recursively
//       fs.mkdirParent(path.dirname(dirPath), mode, callback);
//       //And then the directory
//       fs.mkdirParent(dirPath, mode, callback);
//     }
//     //Manually run the callback since we used our own callback to do all these
//     callback && callback(error);
//   });
// };

// fs.mkdirParent(path.join(__dirname, 'uploads'));

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, 'uploads'))
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })

const storage = multer.memoryStorage({
  destination: function(req, file, callback) {
   callback(null, "");
  },
 })

const upload = multer({ storage: storage })

const corsOptions = {
  // origin: "http://localhost:5173",
  origin: ["http://localhost:5173", 'https://inkgarden.info/'],
  methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/form", contactRouter);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRouter);
app.use('/api/like', likeRoutes);
app.use('/api/comment', commentRoutes);


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/blog/upload', upload.single('file'), async function (req, res, next) {
  try {
    console.log("1-post",req.file);
    const profileImageUploadResult =  cloudinary.v2.uploader.upload_stream(
      {
        folder: `uploads`,
        public_id: req.file.filename
      },function(error, result) {
        console.log(error, result);
        return res.json(result.url);
    }
    );
    // fs.createReadStream(req.file.buffer).pipe(profileImageUploadResult)
    streamifier.createReadStream(req.file.buffer).pipe(profileImageUploadResult);
    // console.log("2-post",profileImageUploadResult);
    // fs.unlinkSync(req.file.path);
    // console.log("3-post");
    // return res.json(profileImageUploadResult.url);
    // return res.end()
  } catch (error) {
    console.log('Error uploading image', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
})
app.put('/api/blog/:id/upload', upload.single('file'), async function (req, res, next) {
  try {
    const profileImageUploadResult = await cloudinary.v2.uploader.upload(
      req.file.path,
      {
        folder: `uploads`,
        public_id: req.file.filename
      }
    );
    fs.unlinkSync(req.file.path);
    return res.json(profileImageUploadResult.url);
  } catch (error) {
    console.log('Error updating image', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.get('/', async (req, res) => {
  try {
    return res.json('Hello Server');
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
});

app.get('/api/blog/:blogid', async (req, res) => {
  try {
    const blogid = req.params.blogid;
    const eachblog = await blog.findOne({ _id: blogid });
    return res.json({ eachblog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return res.status(500).json({ message: 'Failed to fetch blog' });
  }
});
app.use(errorMiddleware);

app.listen(8000, () => {
  console.log(`server running on port 8000 👍`);
});


module.exports = app