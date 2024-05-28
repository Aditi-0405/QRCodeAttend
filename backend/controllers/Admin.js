const Attendance= require('../models/Attendance'); 
const markAttendance =  async (req, res) => {//'/markAttendance' POST
  try {
    const { studentId, date, status } = req.body;
    console.log(status)

    let attendanceRecord = await Attendance.findOne();
    if (!attendanceRecord) {
      attendanceRecord = new Attendance();
    }

    if (!attendanceRecord.studentAttendance) {
      attendanceRecord.studentAttendance = new Map();
    }

    let studentAttendance = attendanceRecord.studentAttendance.get(studentId);
    if (!studentAttendance) {
      studentAttendance = [];
      attendanceRecord.studentAttendance.set(studentId, studentAttendance);
      studentAttendance = attendanceRecord.studentAttendance.get(studentId);
    }

    const existingRecordIndex = studentAttendance.findIndex(record => record.date.toDateString() === new Date(date).toDateString());
    if (existingRecordIndex !== -1) {
      studentAttendance[existingRecordIndex].status = status;
    } else {
      console.log("studentAtten", studentAttendance)
      studentAttendance.push({ date: new Date(date), status });
      console.log("studentAtten", studentAttendance)
    }

    await attendanceRecord.save();

    console.log('Attendance marked successfully');
    console.log('Attendance Record:', attendanceRecord.toObject());

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



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


const getAllAttendance = async (req, res) => {//'/getAllAttendance' POST
  try {
    const attendanceRecords = await Attendance.findOne();
    if (!attendanceRecords) {
      return res.status(404).json({ error: 'No attendance records found' });
    }
    // Converting Map to plain object
    const attendanceObject = Object.fromEntries(attendanceRecords.studentAttendance);
    console.log(attendanceObject)
    res.status(200).json(attendanceObject);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateAttendance = async (req, res) => {//'/updateAttendance' PATCH
  try {
    const { studentId, date, status } = req.body;

    let attendanceRecord = await Attendance.findOne();
    if (!attendanceRecord) {
      return res.status(404).json({ error: 'No attendance records found' });
    }

    if (!attendanceRecord.studentAttendance) {
      attendanceRecord.studentAttendance = new Map();
    }

    let studentAttendance = attendanceRecord.studentAttendance.get(studentId);
    if (!studentAttendance) {
      studentAttendance = [];
      attendanceRecord.studentAttendance.set(studentId, studentAttendance);
    }

    const existingRecordIndex = studentAttendance.findIndex(record => record.date.toDateString() === new Date(date).toDateString());
    if (existingRecordIndex !== -1) {
      studentAttendance[existingRecordIndex].status = status;
    } else {
      studentAttendance.push({
        date: new Date(date),
        status: status
      });
    }

    await attendanceRecord.save();

    console.log('Attendance updated successfully');
    console.log('Updated Attendance Record:', attendanceRecord.toObject());

    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = { markAttendance };
