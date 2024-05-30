import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../SharedStyling/StudentAttendance.css';

const StudentAttendance = () => {
  const { studentId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/admin/getStudentAttendance/${studentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendance');
        }

        const data = await response.json();
        console.log(data);
        setAttendance(data.attendance);
        setStudentName(data.studentName);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, [studentId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Student Attendance</h1>
      {attendance.length > 0 && (
        <div style={{ marginTop: '20px', display: 'inline-block', textAlign: 'left' }}>
          <h2>{studentName}'s Weekly Attendance</h2>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index}>
                  <td>{formatDate(record.date)}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
