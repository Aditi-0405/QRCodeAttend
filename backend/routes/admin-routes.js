const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');

router.post('/createStudent', adminControllers.createStudent);
router.post('/markAttendance', adminControllers.markAttendance);
router.get('/getAllAttendance', adminControllers.getAllAttendance);
router.patch('/updateAttendance', adminControllers.updateAttendance);
router.get('/getAllStudents', adminControllers.getAllStudents);
router.get('/getStudent/:studentId', adminControllers.getStudent);
router.delete('/deleteStudent/:studentId', adminControllers.deleteStudent);
router.get('/getStudentAttendance/:studentId', adminControllers.getStudentAttendance);

module.exports = router;