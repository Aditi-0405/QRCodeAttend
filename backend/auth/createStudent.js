
const express = require('express');
const bcrypt = require('bcryptjs');


const router = express.Router();
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const Student = require('../models/student');

router.post('/createStudent', async (req, res) => {
    const { username, password} = req.body;
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
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const newUser = new Student({ email: username, password });
        
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;