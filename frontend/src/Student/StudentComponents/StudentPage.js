import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import '../StudentStyling/StudentPage.css' 

const StudentPage = () => {
  const [qrCodeData, setQRCodeData] = useState('');
  const [weeklyAttendance, setWeeklyAttendance] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQRCodeData = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = 'present';
    const studentId = localStorage.getItem('userId');
    console.log(studentId)
    const qrData = `studentId=${studentId}&date=${currentDate}&status=${status}`;
    console.log(qrData)
    setQRCodeData(qrData);
  };

  const fetchWeeklyAttendance = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/student/getWeeklyAttendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Weekly Attendance Data:', response.data);
      setWeeklyAttendance(response.data.weeklyAttendance);
    } catch (err) {
      console.error('Error fetching weekly attendance:', err); 
      setError('Failed to fetch weekly attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      <h1>Attendance Management</h1>
      <button onClick={generateQRCodeData} className="btn">Generate QR Code</button>
      {qrCodeData && (
        <div className="qr-code-container">
          <QRCode value={qrCodeData} />
        </div>
      )}
      <button onClick={fetchWeeklyAttendance} className="btn">Get Weekly Attendance</button>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {Object.keys(weeklyAttendance).length > 0 && (
        <div className="attendance-list">
          <h2>Weekly Attendance</h2>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(weeklyAttendance).map(([date, status], index) => (
                <tr key={index}>
                  <td>{date}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
