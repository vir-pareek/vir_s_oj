import axios from 'axios';

const client = axios.create({
    baseURL: "https://vir-s-oj.onrender.com/api"
    withCredentials: true,
});

export default client;
