import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/getAllAttendance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (typeof response.data === 'object' && response.data !== null) {
        const attendanceArray = Object.entries(response.data).map(([studentId, attendanceObj]) => {
          return { studentId, ...attendanceObj };
        });
        setAttendanceData(attendanceArray);
      } else {
        setAttendanceData([]);
        setError('Invalid attendance data format');
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching attendance data');
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <nav className="admin-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/teacher-dashboard" className="nav-link">Teacher Dashboard</Link>
          </li>
        </ul>
      </nav>
      <div className="admin-content">
        <div className="attendance-section">
          <button onClick={fetchAttendanceData} disabled={loading} className="fetch-attendance-button">
            {loading ? 'Loading...' : 'Get All Attendance'}
          </button>
          {error && <p className="error-message">{error}</p>}
          {attendanceData && (
            <div className="attendance-data">
              <h2>All Attendance Records</h2>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    {Object.keys(attendanceData[0]).filter(key => key !== 'studentId').map(date => (
                      <th key={date}>{date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record) => (
                    <tr key={record.studentId}>
                      <td>{record.studentId}</td>
                      {Object.values(record).filter((value, index) => index !== 0).map((value, index) => (
                        <td key={index}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
