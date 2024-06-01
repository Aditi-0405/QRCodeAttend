import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../SharedStyling/StudentAttendance.css';

const StudentAttendance = () => {
  const { studentId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [message, setMessage] = useState('');

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
        setAttendance(data.attendance);
        setStudentName(data.studentName);
        setStudentRollNumber(data.rollNumber);
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

  const handleToggleStatus = async (record) => {
    const newStatus = record.status === 'present' ? 'absent' : 'present';
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/updateAttendance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, date: record.date, status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }

      const data = await response.json();
      console.log(data);
      setAttendance(attendance.map(rec =>
        rec.date === record.date ? { ...rec, status: newStatus } : rec
      ));
      setMessage(<>
        Attendance updated successfully: <br/>
        {record.date} : {newStatus}
      </>);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Student Attendance</h1>
      <h2>Name: {studentName}</h2>
      <h2>Roll No: {studentRollNumber}</h2>
      {message && <p className="success-message">{message}</p>}
      {attendance.length > 0 && (
        <div style={{ marginTop: '20px', display: 'inline-block', textAlign: 'left' }}>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index}>
                  <td>{formatDate(record.date)}</td>
                  <td className={record.status === 'present' ? 'present' : 'absent'}>
                    {record.status}
                  </td>
                  <td>
                    <span
                      className="toggle-icon"
                      data-next-status={record.status === 'present' ? 'Change to absent' : 'Change to present'}
                      onClick={() => handleToggleStatus(record)}
                    >
                      &#x21C5; {/* Toggle Icon */}
                    </span>
                  </td>
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
