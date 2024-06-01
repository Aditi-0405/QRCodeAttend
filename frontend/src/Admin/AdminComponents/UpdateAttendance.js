import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Shared/SharedStyling/FormStyles.css';

const UpdateAttendance = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    date: '',
    status: ''
  });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/getAllStudents', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        let studentsData = response.data.students;
        if (!Array.isArray(studentsData)) {
          studentsData = [studentsData];
        }
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching students');
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudentFilter = (input) => {
    const filtered = students.filter(student => {
      return (student.rollNumber.toString().toLowerCase().includes(input.toLowerCase())) ||
             (student.username.toLowerCase().includes(input.toLowerCase()));
    });
    setFilteredStudents(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('http://localhost:5000/api/admin/updateAttendance', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      const rollNumber = response.data.student.rollNumber
      const username = response.data.student.username
      setMessage(
        <>
          Attendance for {rollNumber} : {username} updated successfully<br/>
          {formData.date} : {formData.status}
        </>
      ); 
      setError('');
      setTimeout(() => {
        setMessage('');
        setFormData({ studentId: '', date: '', status: '' });
      }, 5000);
    } catch (error) {
      console.error(error);
      setError('Error updating attendance');
      setMessage('');
    }
  };

  return (
    <div className="form-container">
      <h2>Update Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label></label>
          <input 
            type="text" 
            placeholder="Search by roll number or username"
            onChange={(e) => handleStudentFilter(e.target.value)}
          />
          <select name="studentId" value={formData.studentId} onChange={handleChange}>
            <option value="">Select student</option>
            {filteredStudents.map((student) => (
              <option key={student._id} value={student._id}>
                {student.rollNumber} : {student.username}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">Select status</option>
            <option value="present">present</option>
            <option value="absent">absent</option>
          </select>
        </div>
        <button type="submit" className="form-button">Update Attendance</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UpdateAttendance;
