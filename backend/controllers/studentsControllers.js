
const Attendance= require('../models/Attendance'); 
const Student= require('../models/student')

const getWeeklyAttendance =async (req, res) => {
    try {
      const decoded = req.user
      const student = await Student.findById(decoded.userId);
      if (!student) {
        return res.status(403).json({ message: 'Student not found' });
      }
      const studentId = student._id.toString();
      const today = new Date();
      const dayOfWeek = today.getUTCDay();
      const startOfWeek = new Date(today);
      startOfWeek.setUTCDate(today.getUTCDate() - dayOfWeek);
      startOfWeek.setUTCHours(0, 0, 0, 0);
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
      endOfWeek.setUTCHours(23, 59, 59, 999);
  
      const attendanceRecord = await Attendance.findOne();
      console.log(studentId)
      if (!attendanceRecord || !attendanceRecord.studentAttendance.has(studentId)) {
        return res.status(404).json({ error: 'Student ID not found' });
      }
  
      const studentAttendance = attendanceRecord.studentAttendance.get(studentId);
      let weeklyAttendance = {};
  
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setUTCDate(startOfWeek.getUTCDate() + i);
  
        if (currentDay > today) {
          weeklyAttendance[currentDay.toISOString().split('T')[0]] = 'N/A';
        } else {
          weeklyAttendance[currentDay.toISOString().split('T')[0]] = 'absent';
        }
      }
  
      studentAttendance.forEach(record => {
        const recordDate = record.date.toISOString().split('T')[0];
        if (weeklyAttendance.hasOwnProperty(recordDate)) {
          weeklyAttendance[recordDate] = record.status;
        }
      });
  
      res.status(200).json({ weeklyAttendance });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {getWeeklyAttendance}