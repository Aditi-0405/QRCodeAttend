const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentAttendance: {
    type: Map,
    of: [{
      date: { type: Date, required: true },
      status: { type: String,  default: 'absent' }
    }]
  }
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
