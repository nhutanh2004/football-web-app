import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserProfilePage = () => {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData(prev => ({ ...prev, email: res.data.email }));
      } catch (err) {
        console.error('Error fetching user info:', err.response?.data || err);
        setError('Failed to load user info.');
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/users/${userId}`, {
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profile updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Update Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* <div style={{ marginBottom: 10 }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div> */}

        {/* Current password */}
        <div style={{ marginBottom: 10 }}>
          <label>Mật khẩu hiện tại:</label><br />
          <div style={{ position: 'relative' }}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Mật khẩu hiện tại"
              autoComplete="current-password"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'grey',
              }}
            >
              {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div style={{ marginBottom: 10 }}>
          <label>Mật khẩu mới:</label><br />
          <div style={{ position: 'relative' }}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Mật khẩu mới"
              required
              autoComplete="new-password"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'grey',
              }}
            >
              {showNewPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* Confirm new password */}
        <div style={{ marginBottom: 10 }}>
          <label>Nhập lại mật khẩu mới:</label><br />
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              required
              autoComplete="new-password"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'grey',
              }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
        </button>
      </form>
    </div>
  );
};

export default UserProfilePage;
