import React, { useEffect, useState } from "react";
import axios from "axios";
import "../User/UserStyles.css";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [editData, setEditData] = useState({ username: "", email: "", role: "" });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/auth/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            console.error("❌ Lỗi khi xóa người dùng:", err);
        }
    };

    const handleEdit = (user) => {
        setEditUserId(user._id);
        setEditData({ username: user.username, email: user.email, role: user.role });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/auth/users/${editUserId}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditUserId(null);
            fetchUsers();
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật người dùng:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="user-container">
            <h2>👤 Quản lý người dùng</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Quyền</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>
                                {editUserId === u._id ? (
                                    <input
                                        value={editData.username}
                                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                    />
                                ) : (
                                    u.username
                                )}
                            </td>
                            <td>
                                {editUserId === u._id ? (
                                    <input
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    />
                                ) : (
                                    u.email
                                )}
                            </td>
                            <td>
                                {editUserId === u._id ? (
                                    <select
                                        value={editData.role}
                                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                ) : (
                                    u.role
                                )}
                            </td>
                            <td>
                                {editUserId === u._id ? (
                                    <>
                                        <button onClick={handleUpdate}>💾 Lưu</button>
                                        <button onClick={() => setEditUserId(null)}>❌ Hủy</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(u)}>✏️ Sửa</button>
                                        <button onClick={() => handleDelete(u._id)}>🗑️ Xóa</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserPage;
