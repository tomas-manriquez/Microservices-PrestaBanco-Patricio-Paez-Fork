import httpClient from "../http-common.js";

const list = () => {
    return httpClient.get('/api/users/');
}

const get = id => {
    return httpClient.get(`/api/users/${id}`);
}

const update = data => {
    return httpClient.put('/api/users/', data);
}

const remove = id => {
    return httpClient.delete(`/api/users/${id}`);
}

const login = data => {
    return httpClient.post('/api/users/login', data);
}

const register = data => {
    return httpClient.post('/api/users/register', data);
}

export default { list, get, update, remove, register, login};