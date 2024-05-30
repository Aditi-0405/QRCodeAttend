import React, { useState } from 'react';
import axios from 'axios';
import './FormStyles.css'; 

const UpdateAttendance = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    date: '',
    status: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch('http://localhost:5000/api/admin/updateAttendance', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Attendance updated successfully');
      setError('');
    } catch (error) {
      console.log(error)
      setError('Error updating attendance');
      setMessage('');
    }
  };

  return (
    <div className="form-container">
      <h2>Update Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student ID:</label>
          <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <input type="text" name="status" value={formData.status} onChange={handleChange} />
        </div>
        <button type="submit" className="form-button">Update Attendance</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UpdateAttendance;
