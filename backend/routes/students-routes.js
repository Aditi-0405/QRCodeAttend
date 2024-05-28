
const express = require('express');
const router = express.Router();

const studentControllers = require('../controllers/studentsControllers')

router.get('/getWeeklyAttendance/:id', studentControllers.getWeeklyAttendance)

module.exports = router;