
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getAllAttendance');
        setAttendanceData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const renderTable = () => {
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error: {error}</p>;
    } else {
      const weekDates = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i);
        weekDates.push(date.toISOString().slice(0, 10));
      }
      return (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              {weekDates.map(date => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(attendanceData).map(studentId => (
              <tr key={studentId}>
                <td>{studentId}</td>
                {weekDates.map(date => {
                  const attendanceRecord = attendanceData[studentId].find(record => record.date.slice(0, 10) === date);
                  const status = attendanceRecord ? attendanceRecord.status : date <= new Date().toISOString().slice(0, 10) ? 'absent' : 'N/A';
                  return <td key={`${studentId}-${date}`}>{status}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div>
      <h2>Attendance Table</h2>
      {renderTable()}
    </div>
  );
};

export default AttendanceTable;




