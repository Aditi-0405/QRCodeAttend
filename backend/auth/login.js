
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const Student = require('../models/student');

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin || !await admin.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: admin._id, role: 'admin' }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const studentLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const student = await Student.findOne({ username });
        if (!student || !await student.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: student._id, role: 'student' }, 'secret', { expiresIn: '1h' });
        res.json({ token, userId: student._id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {adminLogin, studentLogin}
