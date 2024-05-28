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
const createStudent =  async (req, res) => {
  const { username, password } = req.body;
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
    const newUser = new Student({ username, password });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { markAttendance,getAllAttendance ,updateAttendance, createStudent};
