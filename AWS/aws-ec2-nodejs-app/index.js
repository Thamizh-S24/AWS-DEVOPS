const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from "public" folder
app.use(express.static('public'));

// Serve uploaded images from "uploads" folder
app.use('/uploads', express.static('uploads'));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 👉 Root Route: Homepage
app.get('/', (req, res) => {
  res.send(`
    <h2>Welcome to the EC2 File Upload App</h2>
    <p><a href="/login">Login Page</a></p>
    <p><a href="/signup">Signup Page</a></p>
    <p><a href="/upload">Upload Page</a></p>
  `);
});

// 👉 Dummy Login Route (UI only)
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// 👉 Dummy Signup Route (UI only)
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// 👉 Working Upload Form Page
app.get('/upload', (req, res) => {
  res.sendFile(__dirname + '/public/upload.html');
});

// 👉 Real Upload Logic (POST)
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  res.send(`
    <h2>Upload Success</h2>
    <p>File: ${req.file.originalname}</p>
    <img src="/uploads/${req.file.filename}" width="300">
    <br><br>
    <a href="/upload">Upload Another</a>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 App running at http://localhost:${port}`);
});
