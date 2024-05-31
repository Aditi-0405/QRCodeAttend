const Attendance = require('../models/Attendance');
const Admin = require('../models/admin')
const Student = require('../models/student')
const { sendmail } = require('../auth/nodemailer');
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const decoded = req.user
    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

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
      studentAttendance.push({ date: new Date(date), status });
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


const getAllAttendance = async (req, res) => {
  try {
    const decoded = req.user
    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(403).json({ message: 'Only admins can access the record' });
    }
    const attendanceRecord = await Attendance.findOne();
    if (!attendanceRecord) {
      return res.status(404).json({ error: 'No attendance records found' });
    }
    const defaultAttendance = {};
    const today = new Date();
    const dayOfWeek = today.getUTCDay();
    const startOfWeek = new Date(today);
    startOfWeek.setUTCDate(today.getUTCDate() - dayOfWeek);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setUTCDate(startOfWeek.getUTCDate() + i);

      if (currentDay > today) {
        defaultAttendance[currentDay.toISOString().split('T')[0]] = 'N/A';
      } else {
        defaultAttendance[currentDay.toISOString().split('T')[0]] = 'absent';
      }
    }
    const students = await Student.find();
    const attendanceObject = {}
    students.forEach(student => {
      const studentId = student._id.toString();
      if (!attendanceRecord.studentAttendance.has(studentId)) {
        attendanceObject[studentId] = defaultAttendance
      }
      else {
        let weeklyAttendance = JSON.parse(JSON.stringify(defaultAttendance));
        const studentAttendance = attendanceRecord.studentAttendance.get(studentId);
        studentAttendance.forEach(record => {
          const recordDate = record.date.toISOString().split('T')[0];
          if (weeklyAttendance.hasOwnProperty(recordDate)) {
            weeklyAttendance[recordDate] = record.status;
          }
        });
        attendanceObject[studentId] = weeklyAttendance
      }
    })
    res.status(200).json(attendanceObject);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const decoded = req.user
    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(403).json({ message: 'Only admins can update attendance' });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404).json({ message: 'No student found' });
    }
    else {
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
        studentAttendance.push({
          date: new Date(date),
          status: status
        });
      }

      await attendanceRecord.save();

      res.status(200).json({ message: 'Attendance updated successfully', student });
    }
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const createStudent = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: '"username", "email", "password" fields are required' });
  }

  try {
    const decoded = req.user;
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return res.status(403).json({ message: 'Only admins can create users' });
    }

    const newUser = new Student({ username, email, password });

    await sendmail(username, email, password);
    
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const getAllStudents = async (req, res) => {
  try {
    const decoded = req.user;
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return res.status(403).json({ message: 'Not Authorized' });
    }
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const decoded = req.user;
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const student = await Student.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let attendanceRecord = await Attendance.findOne();
    if (attendanceRecord && attendanceRecord.studentAttendance) {
      attendanceRecord.studentAttendance.delete(studentId);
      await attendanceRecord.save();
    }

    res.status(200).json({ message: 'Student deleted successfully', student });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const decoded = req.user;
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let attendanceRecord = await Attendance.findOne();
    if (!attendanceRecord || !attendanceRecord.studentAttendance) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    const defaultAttendance = [];
    const today = new Date();
    const dayOfWeek = today.getUTCDay();
    const startOfWeek = new Date(today);
    startOfWeek.setUTCDate(today.getUTCDate() - dayOfWeek);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setUTCDate(startOfWeek.getUTCDate() + i);

      if (currentDay > today) {
        defaultAttendance.push({ date: currentDay.toISOString().split('T')[0], status: 'N/A' });
      } else {
        defaultAttendance.push({ date: currentDay.toISOString().split('T')[0], status: 'absent' });
      }
    }

    const studentAttendance = attendanceRecord.studentAttendance.get(studentId);
    if (studentAttendance) {
      studentAttendance.forEach(record => {
        const recordDate = record.date.toISOString().split('T')[0];
        const index = defaultAttendance.findIndex(item => item.date === recordDate);
        if (index !== -1) {
          defaultAttendance[index].status = record.status;
        }
      });
    }

    res.status(200).json({ studentName: student.username, attendance: defaultAttendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = { markAttendance, getAllAttendance, updateAttendance, createStudent, getAllStudents, deleteStudent, getStudentAttendance };
