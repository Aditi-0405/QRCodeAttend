const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Attendance = require('./models/Attendance');
const app = express();
const atlasUri = process.env.MONGO_URI;
const bodyParser = require('body-parser');
const Admin = require('./models/admin')
const Student = require('./models/student')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(5000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/createStudent', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }
    const decoded = jwt.verify(token, 'secret');

    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(403).json({ message: 'Only admins can create users' });
    }
    const newUser = new Student({username, password });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      console.log('Admin:', admin);
      console.log('Provided Password:', password);
      console.log('Hashed Password:', admin ? admin.password : 'N/A');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: admin._id, role: 'admin' }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/student/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne({ username });

    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: student._id, role: 'student' }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;


