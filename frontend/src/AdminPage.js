import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <nav className="admin-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <button className="nav-button" onClick={() => navigate('/teacher-dashboard')}>Teacher Dashboard</button>
          </li>
          <li className="nav-item">
            <button className="nav-button" onClick={() => navigate('/getAllAttendance')}>Get All Attendance</button>
          </li>
          <li className="nav-item">
            <button className="nav-button" onClick={() => navigate('/update-attendance')}>Update Attendance</button>
          </li>
          <li className="nav-item">
            <button className="nav-button" onClick={() => navigate('/create-student')}>Create Student</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminPage;
