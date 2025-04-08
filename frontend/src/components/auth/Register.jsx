import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../auth/css/Register.css";

const Register = () => {
    const [userData, setUserData] = useState({ username: "", email: "", password: "", role: "user" });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:5000/api/auth/register", userData);
        navigate("/login");
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    required
                />
                <select
                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
    
};

export default Register;
