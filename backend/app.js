const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/connectDB');
const studentsRoutes = require('./routes/students-routes');
const adminRoutes = require('./routes/admin-routes');
const authRoutes = require('./routes/auth-routes');
const { isAuthenticated } = require('./auth/authenticate');

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDB().then(() => {
  app.listen(5000, () => {
    console.log('Server started on port 5000');
  });
});

app.use('/api/login', authRoutes);
app.use('/api/student', isAuthenticated, studentsRoutes);
app.use('/api/admin', isAuthenticated, adminRoutes);
