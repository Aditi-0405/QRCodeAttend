
const Attendance= require('../models/Attendance'); 

const getWeeklyAttendance =async (req, res) => {//'/getWeeklyAttendance' POST
    try {
      const { studentId } = req.body;
  
      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
      }
  
      const today = new Date();
      const dayOfWeek = today.getUTCDay();
      const startOfWeek = new Date(today);
      //startOfWeek.setUTCDate(today.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // starting from Monday
      startOfWeek.setUTCDate(today.getUTCDate() - dayOfWeek);//starting from Sunday
      startOfWeek.setUTCHours(0, 0, 0, 0); // Setting to midnight
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6); // Setting to end of Sunday
      endOfWeek.setUTCHours(23, 59, 59, 999); // End of the day
  
      const attendanceRecord = await Attendance.findOne();
  
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
  
      res.status(200).json({ studentId, weeklyAttendance });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {getWeeklyAttendance}