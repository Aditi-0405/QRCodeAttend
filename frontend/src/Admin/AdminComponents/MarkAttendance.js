import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import '../AdminStyling/MarkAttendance.css';

const MarkAttendance = () => {
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const scannedStudentIds = [];

  const handleScan = async (data) => {
    if (data) {
      const { studentId, date } = extractDataFromQR(data);
      let response
      let username
      let rollNumber
      let student
      try {
        response = await axios.get(
          `http://localhost:5000/api/admin/getStudent/${studentId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        console.log(response)
        student = response.data.student
        console.log(student)
        if(student) rollNumber = student.rollNumber
        if(student) username = student.username
      } catch (error) {
        throw error;
      }

      if (studentId && date) {
        if(!student){
            setErrorMessage(
              <>Student record not Found</>
            );
            setTimeout(() => {
              setErrorMessage('');
            }, 5000);
        }
        else if (!scannedStudentIds.includes(studentId)) {
          scannedStudentIds.push(studentId);
          try {
            await markAttendance(studentId, date);
            setErrorMessage('')
            setAttendanceMessage(
              <>
                Attendance marked successfully for <br />
                {rollNumber}@{username}</>
            );
            setTimeout(() => {
              setAttendanceMessage('');
            }, 5000);
          } catch (error) {
            setAttendanceMessage('')
              setErrorMessage(
                <>
                 ' Error Marking Attendance'
                </>
              );
            setTimeout(() => {
              setAttendanceMessage('');
            }, 5000);

          }
        }
        else { 
          setErrorMessage('')
          setAttendanceMessage(
            <>
              Attendance already marked successfully for <br />
              {rollNumber}@{username}</>
          );
          setTimeout(() => {
            setAttendanceMessage('');
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

  const markAttendance = async (studentId, date) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/markAttendance',
        { studentId, date, status: 'present' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response;
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default MarkAttendance;
