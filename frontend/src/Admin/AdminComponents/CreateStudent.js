import React, { useState } from 'react';
import axios from 'axios';
import '../../Shared/SharedStyling/FormStyles.css';

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      setMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/admin/createStudent', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const rollNumber = response.data.newUser.rollNumber;
      const username = response.data.newUser.username;
      setMessage(
        <>
          Student created successfully <br />
          Roll Number : {rollNumber} <br />
          Username : {username}
        </>
      );
      setError('');
      setTimeout(() => {
        setMessage('');
        setFormData({ username: '', email: '', password: '' });
      }, 5000); 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized access. Please log in again.');
      } else {
        setError('Error creating student. Please try again later.');
      }
      setMessage('');
    }
  };

  return (
    <div className="form-container">
      <h2>Create Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit" className="form-button">Create Student</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateStudent;
