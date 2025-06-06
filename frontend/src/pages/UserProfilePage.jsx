import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfilePage = () => {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(prev => ({ ...prev, email: res.data.email }));
      } catch (err) {
        console.error('Error fetching user info:', err); // Thêm console log
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
    setIsLoading(true); // Khóa nút khi bắt đầu gửi yêu cầu

    if (formData.newPassword !== formData.confirmNewPassword) {
      console.error('Password mismatch:', {
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      }); // Thêm console log
      setError('New passwords do not match.');
      setIsLoading(false); // Mở khóa nút nếu có lỗi
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${userId}`, {
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err); // Thêm console log
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false); // Mở khóa nút sau khi yêu cầu hoàn tất
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Update Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Current Password:</label><br />
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            placeholder="Current password"
            autoComplete='current-password'
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>New Password:</label><br />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New password"
            required
            autoComplete='new-password'
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Confirm New Password:</label><br />
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfilePage;