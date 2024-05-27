const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Attendance = require('./models/Attendance');
const app = express();
const atlasUri = process.env.MONGO_URI;
const bodyParser = require('body-parser');

const router = express.Router();
mongoose.connect(atlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(5000, () => {
            console.log('Server started on port 3000');
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.get('/', (req, res) => {
    res.json({ mag: "hi" })
})
app.post('/markAttendance', async (req, res) => {
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
});


app.post('/getWeeklyAttendance', async (req, res) => {
    try {
      const { studentId } = req.body;
  
      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
      }
  
      const today = new Date();
      const dayOfWeek = today.getUTCDay(); 
      const startOfWeek = new Date(today);
    //   startOfWeek.setUTCDate(today.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // starting from Monday
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
  });
  
  app.get('/getAllAttendance', async (req, res) => {
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
  });
  

module.exports = router;

