import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? 'http://localhost:5000/api' : '/api',
    withCredentials: true,
});

export default client;
