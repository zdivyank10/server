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
const multer = require('multer');
const cloudinary = require('cloudinary').v2;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

const corsOptions = {
  // origin: "http://localhost:5173",
  origin: ["http://localhost:5173", "https://inkgarden.info"],
  methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
  credentials: true
};

connectDb();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/form", contactRouter);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRouter);
app.use('/api/like', likeRoutes);
app.use('/api/comment', commentRoutes);

cloudinary.config({
  cloud_name: 'do3wjoksd',
  api_key: '883647493517116',
  api_secret: 'QaRCtqSkdSa9NdAjDct237CLFj4'
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.post('/api/blog/upload', upload.single('file'), function (req, res, next) {
//   return res.json(req.file.filename);
// })
// app.put('/api/blog/:id/upload', upload.single('file'), function (req, res, next) {
//   return res.json(req.file.filename);
// });

app.post('/api/blog/upload', upload.single('file'), function (req, res, next) {
  // Upload file to Cloudinary
  cloudinary.uploader.upload(req.file.path, function(error, result) {
    if (error) {
      // Handle error
      return next(error);
    }
    // Delete local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);
    // Return Cloudinary URL of the uploaded file
    return res.json({ url: result.secure_url });
  });
});

app.put('/api/blog/:id/upload', upload.single('file'), function (req, res, next) {
  // Upload file to Cloudinary
  cloudinary.uploader.upload(req.file.path, function(error, result) {
    if (error) {
      // Handle error
      return next(error);
    }
    // Delete local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);
    // Return Cloudinary URL of the uploaded file
    return res.json({ url: result.secure_url });
  });
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
    return  res.json({ eachblog });
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