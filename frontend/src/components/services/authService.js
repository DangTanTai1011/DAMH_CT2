import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData) => axios.post(`${API_URL}/register`, userData);
export const login = async (userData) => axios.post(`${API_URL}/login`, userData);
export const logout = async () => axios.post(`${API_URL}/logout`);
