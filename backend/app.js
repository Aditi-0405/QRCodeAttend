const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();
const atlasUri = process.env.MONGO_URI;

const studentsRoutes = require('./routes/students-routes')
const adminRoutes = require('./routes/admin-routes')
const authRoutes = require('./routes/auth-routes')
const {isAuthenticated} = require('./auth/authenticate')
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

app.use('/api/login', authRoutes)
app.use('/api/student',isAuthenticated, studentsRoutes)
app.use('/api/admin', isAuthenticated, adminRoutes)