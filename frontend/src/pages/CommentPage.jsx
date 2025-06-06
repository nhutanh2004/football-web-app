import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy tất cả comment
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/comments`);
      setComments(res.data);
    } catch (err) {
      alert("Error fetching comments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Thêm comment mới
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/comments`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComment("");
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding comment");
    }
  };

  // Xóa comment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting comment");
    }
  };

  // Bắt đầu sửa comment
  const startEdit = (id, value) => {
    setEditingId(id);
    setEditValue(value);
  };

  // Lưu comment đã sửa
  const handleEdit = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/comments/${id}`,
        { comment: editValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingId(null);
      setEditValue("");
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Error editing comment");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Comments</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          style={{ width: "100%" }}
        />
        <button type="submit">Add Comment</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comments.map((c) => (
            <li key={c._id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
              <strong>{c.user?.username}</strong> ({c.user?.email})<br />
              {editingId === c._id ? (
                <>
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={2}
                    style={{ width: "100%" }}
                  />
                  <button onClick={() => handleEdit(c._id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{c.comment}</span>
                  {/* Hiển thị nút sửa/xóa nếu là comment của mình hoặc là admin */}
                  {(localStorage.getItem("userId") === c.user?._id ||
                    localStorage.getItem("isAdmin") === "true") && (
                    <>
                      <button onClick={() => startEdit(c._id, c.comment)}>Edit</button>
                      <button onClick={() => handleDelete(c._id)}>Delete</button>
                    </>
                  )}
                </>
              )}
              <div style={{ fontSize: 12, color: "#888" }}>
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentPage;