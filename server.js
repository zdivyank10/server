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
  origin: ["http://localhost:5173", "https://inkgarden.info"],
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/blog/upload', upload.single('file'), function (req, res, next) {
  res.json(req.file.filename);
})
app.put('/api/blog/:id/upload', upload.single('file'), function (req, res, next) {
  res.json(req.file.filename);
});

app.get('/', async (req, res) => {
  try {
    res.json('Hello Server');
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
});
app.get('/api/blog/:blogid', async (req, res) => {
  try {
    const blogid = req.params.blogid;
    const eachblog = await blog.findOne({ _id: blogid });
    res.json({ eachblog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
});
app.use(errorMiddleware);

app.listen(8000, () => {
  console.log(`server running on port 8000`);
});


