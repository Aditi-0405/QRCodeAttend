import React, { useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentId, setStudentId] = useState('');
    const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  
    const fetchWeeklyAttendance = async () => {
      try {
        const response = await axios.post('http://localhost:5000/getWeeklyAttendance', { studentId });
        setWeeklyAttendance(response.data.weeklyAttendance);
      } catch (error) {
        console.error('Error fetching weekly attendance:', error);
      }
    };
  
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Student Attendance</h1>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px' }}
        />
        <button onClick={fetchWeeklyAttendance}>Fetch Weekly Attendance</button>
        {weeklyAttendance.length > 0 && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2>Weekly Attendance</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 'auto', width: 'fit-content' }}>
              {weeklyAttendance.map((record, index) => (
                <li key={index}>
                  {new Date(record.date).toLocaleDateString()}: {record.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
};

export default StudentDashboard;
