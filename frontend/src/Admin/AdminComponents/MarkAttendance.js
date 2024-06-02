import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import '../AdminStyling/MarkAttendance.css';

const MarkAttendance = () => {
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scannedStudentIds = [];

  const handleScan = async (data) => {
    if (data) {
      setLoading(true);
      const { studentId, date } = extractDataFromQR(data);
      if (studentId && date) {
        try {
          const student = await fetchStudent(studentId);
          if (student) {
            if (!scannedStudentIds.includes(studentId)) {
              scannedStudentIds.push(studentId);
              await markAttendance(studentId, date);
              setLoading(false); 
              setErrorMessage('');
              setAttendanceMessage(
                <>
                  Attendance marked successfully for <br />
                  {student.rollNumber}@{student.username}
                </>
              );
              setTimeout(() => {
                setAttendanceMessage('');
              }, 5000);
            } else {
              setLoading(false); 
              setErrorMessage('');
              setAttendanceMessage(
                <>
                  Attendance already marked successfully for <br />
                  {student.rollNumber}@{student.username}
                </>
              );
              setTimeout(() => {
                setAttendanceMessage('');
              }, 5000);
            }
          } else {
            setLoading(false);
            setErrorMessage('Student record not found');
            setTimeout(() => {
              setErrorMessage('');
            }, 5000);
          }
        } catch (error) {
          setLoading(false);
          setErrorMessage('Error marking attendance');
          setTimeout(() => {
            setErrorMessage('');
          }, 5000);
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

  const fetchStudent = async (studentId) => {
    try {
      const response = await axios.get(
        `https://qrcodeattend-backend.onrender.com/api/admin/getStudent/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data.student;
    } catch (error) {
      throw error;
    }
  };

  const markAttendance = async (studentId, date) => {
    try {
      await axios.post(
        'https://qrcodeattend-backend.onrender.com/api/admin/markAttendance',
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
      {loading && <p>Loading...</p>} 
      {attendanceMessage && <p className="attendance-message">{attendanceMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default MarkAttendance;
