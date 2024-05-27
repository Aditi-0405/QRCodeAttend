import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';

const TeacherDashboard = () => {
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [scanningEnabled, setScanningEnabled] = useState(true); 
  const scannedStudentIds = [];

  const handleScan = async (data) => {
    if (scanningEnabled && data) {
      console.log('Scanning disabled');
      const { studentId, date } = extractDataFromQR(data);
      if (studentId && date) {
        if (!scannedStudentIds.includes(studentId)) {
          scannedStudentIds.push(studentId); 
          try {
            await markAttendance(studentId, date);
            console.log('Attendance marked successfully:', studentId, date);
            setAttendanceMessage(`Attendance marked successfully for student ID: ${studentId}`);
            setScanningEnabled(false);
            setTimeout(() => setScanningEnabled(true), 5000); 
          } catch (error) {
            console.error('Error marking attendance:', error);
          }
        } else {
          console.log('Student ID already scanned:', studentId);
          setAttendanceMessage(`Student ID ${studentId} already scanned`);
        }
      }
    }
  };

  const handleError = (error) => {
    console.error('QR code scan error:', error);
  };

  const extractDataFromQR = (data) => {
    try {
      const [studentIdData, dateData] = data.text.split('&');
      const studentId = studentIdData.split('=')[1];
      const date = dateData.split('=')[1];
      console.log(`Extracted student ID and date: ${studentId} ${date}`);
      return { studentId, date };
    } catch (error) {
      console.error('Error extracting data from QR code:', error);
      return { studentId: null, date: null };
    }
  };

  const markAttendance = async (studentId, date) => {
    try {
      await axios.post('http://localhost:5000/markAttendance', { studentId, date, status: 'present' });
    } catch (error) {
      throw error;
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
      {attendanceMessage && <p>{attendanceMessage}</p>}
    </div>
  );
};

export default TeacherDashboard;