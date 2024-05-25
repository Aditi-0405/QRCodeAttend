import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

const TeacherDashboard = () => {
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      const { studentId, date } = extractDataFromQR(data);
      try {
        console.log('Attendance marked successfully:', studentId, date);
        setAttendanceRecorded(true);
      } catch (error) {
        console.error('Error marking attendance:', error);
      }
    }
  };

  const handleError = (error) => {
    console.error('QR code scan error:', error);
  };

  const extractDataFromQR = (data) => {
    try {
      console.log("data ===", data)
      const [studentIdData, dateData] = data.text.split('&');
      const studentId = studentIdData.split('=')[1];
      const date = dateData.split('=')[1];
      return { studentId, date };
    } catch (error) {
      console.error('Error extracting data from QR code:', error);
      return { studentId: null, date: null };
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onResult={handleScan}
        style={{ width: '100%' }}
      />
      {attendanceRecorded && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          Attendance recorded for today!
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
