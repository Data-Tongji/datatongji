import axios from 'axios';

const api = axios.create({
    baseURL: 'https://datatongji-backend.com'
});

export default api;
