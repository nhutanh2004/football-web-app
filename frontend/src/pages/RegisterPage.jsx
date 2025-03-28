import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterPage.css'; // Import the CSS file

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('🎉 Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || '❌ Error registering user. Please check your input.');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <p className="description">
        Create your account to get started. Please follow the rules for each field below.
      </p>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Must be at least 5 characters"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Example: yourname@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div className="input-with-icon">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 10 characters, include letters, numbers, and special characters"
            />
            <button type="button" className='onclick' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <div className="input-with-icon">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />
            <button type="button" className='onclick' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
