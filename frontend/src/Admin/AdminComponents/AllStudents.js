import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AdminStyling/AllStudents.css';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/admin/getAllStudents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/deleteStudent/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      setStudents(students.filter(student => student._id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const confirmDelete = (studentId) => {
    const confirmed = window.confirm('Are you sure you want to delete this student?');
    if (confirmed) {
      handleDelete(studentId);
    }
  };

  return (
    <div className="all-students-container">
      <h1>All Students</h1>
      <button className="create-student-button" onClick={() => navigate('/create-student')}>Create Student</button>
      <ul className="students-list">
        {students.map((student) => (
          <li key={student._id} className="student-item">
            <span>{student._id} : {student.username}</span>
            <button className="see-attendance-button" onClick={() => navigate(`/see-attendance/${student._id}`)}>See Attendance</button>
            <button className="delete-student-button" onClick={() => confirmDelete(student._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllStudents;
