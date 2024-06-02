import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import '../StudentStyling/StudentPage.css';

const StudentPage = () => {
  const [qrCodeData, setQRCodeData] = useState('');
  const [weeklyAttendance, setWeeklyAttendance] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);

  const generateQRCodeData = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = 'present';
    const studentId = localStorage.getItem('userId');
    const qrData = `studentId=${studentId}&date=${currentDate}&status=${status}`;
    setQRCodeData(qrData);
    setShowQRCode(true);
    setShowAttendance(false);
  };

  const fetchWeeklyAttendance = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/getWeeklyAttendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWeeklyAttendance(response.data.weeklyAttendance);
      setShowAttendance(true);
      setShowQRCode(false);
    } catch (err) {
      console.error('Error fetching weekly attendance:', err);
      setError('Failed to fetch weekly attendance. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      <h1>Attendance Management</h1>
      <div className="button-container">
        <button
          onClick={generateQRCodeData}
          className={`btn ${showQRCode ? 'active' : ''}`}
        >
          Generate QR Code
        </button>
        <button
          onClick={fetchWeeklyAttendance}
          className={`btn ${showAttendance ? 'active' : ''}`}
        >
          Weekly Attendance
        </button>
      </div>
      {showQRCode && (
        <div className="qr-code-container">
          <h2>Your QR Code</h2>
          <QRCode value={qrCodeData} />
        </div>
      )}
      {showAttendance && (
        <div>
          <h2>Weekly Attendance Status</h2>  
          <div className="attendance-list">
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
                    <td className={status === 'present' ? 'present' : 'absent'}>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default StudentPage;
