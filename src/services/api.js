import axios from 'axios';

const api = axios.create({
    baseURL: 'https://datatongji-backend.herokuapp.com'
});

export default api;
