const Attendance= require('../models/Attendance'); 
const markAttendance = async (studentId, date, status) => {
  try {
    let attendanceRecord = await Attendance.findOne();
    if (!attendanceRecord) {
      attendanceRecord = new Attendance();
    }
    let studentAttendance = attendanceRecord.studentAttendance[studentId];
    if (!studentAttendance) {
      studentAttendance = [];
      attendanceRecord.studentAttendance[studentId] = studentAttendance;
    }

    const existingRecordIndex = studentAttendance.findIndex(record => record.date.toDateString() === date.toDateString());
    if (existingRecordIndex !== -1) {
      studentAttendance[existingRecordIndex].status = status;
    } else {
      studentAttendance.push({ date, status });
    }
    await attendanceRecord.save();
    console.log('Attendance marked successfully');
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};



app.post('/getWeeklyAttendance', async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - Saturday : 0 - 6
    const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))); // Adjust to start from Monday

    // Find the attendance record
    let attendanceRecord = await Attendance.findOne();
    if (!attendanceRecord || !attendanceRecord.studentAttendance.has(studentId)) {
      return res.status(404).json({ error: 'No attendance record found for the student' });
    }

    const studentAttendance = attendanceRecord.studentAttendance.get(studentId);

    // Filter attendance records for the week
    const weeklyAttendance = studentAttendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startOfWeek && recordDate < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000); // Within the week
    });

    res.status(200).json({ weeklyAttendance });
  } catch (error) {
    console.error('Error fetching weekly attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { markAttendance };
