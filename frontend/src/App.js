import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from './Shared/SharedComponents/HomePage';
import StudentLogin from './Student/StudentComponents/StudentLogin';
import AdminLogin from './Admin/AdminComponents/AdminLogin';
import StudentPage from './Student/StudentComponents/StudentPage';
import AdminPage from './Admin/AdminComponents/AdminPage';
import MarkAttendance from './Admin/AdminComponents/MarkAttendance';
import GetAllAttendance from './Admin/AdminComponents/GetAllAttendance';
import AllStudents from './Admin/AdminComponents/AllStudents';
import UpdateAttendance from './Admin/AdminComponents/UpdateAttendance';
import CreateStudent from './Admin/AdminComponents/CreateStudent';
import StudentAttendance from './Shared/SharedComponents/StudentAttendance';
import NavBar from './Shared/SharedComponents/NavBar';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userId') !== null);
  const userRole = localStorage.getItem('role');

  return (
    <div className="app-container">
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="app-content">
        <Routes>
          <Route path="/" element={!isLoggedIn && <HomePage />} />
          <Route path="/student-login" element={!isLoggedIn && <StudentLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/admin-login" element={!isLoggedIn && <AdminLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/student" element={isLoggedIn && userRole === 'student' && <StudentPage />} />
          <Route path="/admin" element={isLoggedIn && userRole === 'admin' && <AdminPage />} />
          <Route path="/mark-attendance" element={isLoggedIn && userRole === 'admin' && <MarkAttendance />} />
          <Route path="/getAllAttendance" element={isLoggedIn && userRole === 'admin' && <GetAllAttendance />} />
          <Route path="/update-attendance" element={isLoggedIn && userRole === 'admin' && <UpdateAttendance />} />
          <Route path="/all-students" element={isLoggedIn&& userRole==='admin' && <AllStudents />} />
          <Route path="/create-student" element={isLoggedIn && userRole === 'admin' && <CreateStudent />} />
          <Route path="/see-attendance/:studentId" element={isLoggedIn && userRole==='admin'&& <StudentAttendance />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;