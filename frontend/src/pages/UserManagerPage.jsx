import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const UserManagerPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", isAdmin: false, role: "user" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token:", decodedToken);
      setCurrentUserRole(decodedToken?.role || "user");
    } catch (e) {
      console.error("Error decoding token:", e);
      setCurrentUserRole("user");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  const startEdit = (user) => {
    const userRole = user.role || "user";
    console.log("Starting edit for user:", user, "Role:", userRole);
    setEditingUser(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: userRole,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", isAdmin: false, role: "user" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Field changed:", name, "New value:", value);
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      console.log("Updated formData:", updatedFormData);
      return updatedFormData;
    });
  };

  const handleSave = async (userId) => {
    console.log("Saving user:", userId, "with data:", formData);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Update response:", response.data);
      await fetchUsers();
      cancelEdit();
    } catch (err) {
      console.error("Error updating user:", err.response?.data);
      alert(err.response?.data?.message || "Error updating user");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-user-page" style={{ padding: 20 }}>
      <h1>Quản lý người dùng</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Quyền chỉnh sửa</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isProtectedAdmin = user.role === "admin"; // Người dùng với role "admin" được bảo vệ
            const isCurrentUserAdmin = currentUserRole === "admin"; // Chỉ admin thật mới chỉnh sửa

            // Vô hiệu hóa chỉnh sửa nếu không phải admin thật hoặc đang chỉnh sửa admin khác
            const isDisabled = !isCurrentUserAdmin || (isProtectedAdmin && currentUserRole !== "admin");

            return (
              <tr key={user._id}>
                {editingUser === user._id ? (
                  <>
                    <td>
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isDisabled}
                      />
                    </td>
                    <td>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isDisabled}
                      />
                    </td>
                    <td>
                      <input
                        name="isAdmin"
                        type="checkbox"
                        checked={formData.isAdmin}
                        onChange={handleChange}
                        disabled={isDisabled}
                      />
                    </td>
                    <td>
                      <select
                        name="role"
                        value={formData.role || "user"}
                        onChange={handleChange}
                        disabled={isDisabled}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleSave(user._id)} disabled={isDisabled}>
                        Save
                      </button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>{user.role || "user"}</td>
                    <td>
                      {(isCurrentUserAdmin) && ( // Chỉ admin thật mới thấy các hành động
                        <>
                          <button onClick={() => handleDelete(user._id)}>Delete</button>
                          <button onClick={() => startEdit(user)}>Edit</button>
                        </>
                      )}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagerPage;