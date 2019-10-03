import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-data-statistic.herokuapp.com'
});

export default api;
