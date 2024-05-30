import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import '../AdminStyling/MarkAttendance.css';

const MarkAttendance = () => {
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const scannedStudentIds = [];

  const handleScan = async (data) => {
    if (scanningEnabled && data) {
      const { studentId, date } = extractDataFromQR(data);
      if (studentId && date) {
        if (!scannedStudentIds.includes(studentId)) {
          scannedStudentIds.push(studentId);
          try {
            await markAttendance(studentId, date);
            setAttendanceMessage(`Attendance marked successfully for student ID: ${studentId}`);
            setScanningEnabled(false);
            setTimeout(() => setScanningEnabled(true), 5000);
          } catch (error) {
            console.error('Error marking attendance:', error);
          }
        } else {
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
      return { studentId, date };
    } catch (error) {
      console.error('Error extracting data from QR code:', error);
      return { studentId: null, date: null };
    }
  };

  const markAttendance = async (studentId, date) => {
    try {
      await axios.post(
        'http://localhost:5000/api/admin/markAttendance',
        { studentId, date, status: 'present' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className='heading'>Scan QR</h1>
      <div className="qr-reader-container">
        <QrReader
          delay={300}
          onError={handleError}
          onResult={handleScan}
          style={{ width: '100%' }}
        />
      </div>
      {attendanceMessage && <p className="attendance-message">{attendanceMessage}</p>}
    </div>
  );
};

export default MarkAttendance;
