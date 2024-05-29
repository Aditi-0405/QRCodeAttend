import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      setAttendanceData(response.data);
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
              <pre>{JSON.stringify(attendanceData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
