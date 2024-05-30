const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');

router.post('/createStudent', adminControllers.createStudent);
router.post('/markAttendance', adminControllers.markAttendance);
router.get('/getAllAttendance', adminControllers.getAllAttendance);
router.patch('/updateAttendance', adminControllers.updateAttendance);

module.exports = router;