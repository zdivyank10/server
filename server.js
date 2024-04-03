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
const multer  = require('multer')

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null,file.originalname)
  }
})
const upload = multer({ storage: storage })

 
  var corsOptions = {
      origin:"http://localhost:5173",
      methods: "GET,POST,DELETE,PUT,PATCH,HEAD",
      credentials: true
      // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

  app.use(cors(corsOptions));    

  // const allowedOrigins = ['https://6b66-2402-a00-172-b05b-a922-e714-b569-6c7d.ngrok-free.app'];
  // const corsOptions = {
  //   origin: function (origin, callback) {
  //     if (allowedOrigins.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   }
  // };
  
  // app.use(cors(corsOptions));

app.use(express.json());    
app.use("/api/auth", authRouter);
app.use("/api/form",contactRouter);
app.use("/api/blog",blogRouter);
// app.use('/api/blog/upload',express.static('uploads'))

// let's define admin route
app.use("/api/admin",adminRouter);
app.use('/api/like', likeRoutes);
app.use('/api/comment', commentRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/api/blog/upload', upload.single('file'), function (req, res, next) {
  // const imagePath = 'http://localhost:8000/' + req.file.path;
  res.json(req.file.filename);
})
app.put('/api/blog/:id/upload', upload.single('file'), function (req, res, next) {
  // Assuming 'fileURL' is the URL where the uploaded file can be accessed
  // const fileURL = `http://localhost:8000/uploads/${req.file.filename}`;

  res.json(req.file.filename);
  // res.json({ fileURL });
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
// blog posting permission.....
app.put('/api/admin/blog/:blogId/permission', blogRouter);



app.use(errorMiddleware);

connectDb().then(()=>{
 
    app.listen(8000,()=>{
        console.log(`server running on port 8000`);
    })
    // app.listen(8000,()=>{
    //     console.log(`server running on port 8000`);
    // })
})

