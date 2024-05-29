import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import StudentLogin from './StudentLogin';
import AdminLogin from './AdminLogin';
import StudentPage from './StudentPage';
import AdminPage from './AdminPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/student-login" className="nav-link">Student Login</Link></li>
            <li className="nav-item"><Link to="/admin-login" className="nav-link">Admin Login</Link></li>
          </ul>
        </nav>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
