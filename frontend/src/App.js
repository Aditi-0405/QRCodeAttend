import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import StudentLogin from './StudentLogin';
import AdminLogin from './AdminLogin';
import StudentPage from './StudentPage';
import AdminPage from './AdminPage';
import TeacherDashboard from './TeacherDashboard';
import GetAllAttendance from './GetAllAttendance';
import UpdateAttendance from './UpdateAttendance';
import CreateStudent from './CreateStudent';

import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userId') !== null);
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <div className="app-container">
      <nav className="app-nav">
        <ul className="nav-list">
          {!isLoggedIn && <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>}
          {!isLoggedIn && <li className="nav-item"><Link to="/student-login" className="nav-link">Student Login</Link></li>}
          {!isLoggedIn && <li className="nav-item"><Link to="/admin-login" className="nav-link">Admin Login</Link></li>}
          {isLoggedIn && userRole === 'student' && (
            <>
              <li className="nav-item"><Link to="/student" className="nav-link">Student Page</Link></li>
              <li className="nav-item"><span className="nav-link">User ID: {localStorage.getItem('userId')}</span></li>
              <li className="nav-item"><button onClick={handleLogout} className="nav-link">Logout</button></li>
            </>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <>
              <li className="nav-item"><Link to="/admin" className="nav-link">Admin Page</Link></li>
              <li className="nav-item"><span className="nav-link">User ID: {localStorage.getItem('userId')}</span></li>
              <li className="nav-item"><button onClick={handleLogout} className="nav-link">Logout</button></li>
            </>
          )}
        </ul>
      </nav>
      <div className="app-content">
        <Routes>
          <Route path="/" element={!isLoggedIn && <HomePage />} />
          <Route path="/student-login" element={!isLoggedIn && <StudentLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/admin-login" element={!isLoggedIn && <AdminLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/student" element={isLoggedIn && userRole === 'student' && <StudentPage />} />
          <Route path="/admin" element={isLoggedIn && userRole === 'admin' && <AdminPage />} />
          <Route path="/teacher-dashboard" element={isLoggedIn && userRole === 'admin' && <TeacherDashboard />} />
          <Route path="/getAllAttendance" element={isLoggedIn && userRole === 'admin' && <GetAllAttendance />} />
          <Route path="/update-attendance" element={isLoggedIn && userRole === 'admin' && <UpdateAttendance />} />
          <Route path="/create-student" element={isLoggedIn && userRole === 'admin' && <CreateStudent />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
