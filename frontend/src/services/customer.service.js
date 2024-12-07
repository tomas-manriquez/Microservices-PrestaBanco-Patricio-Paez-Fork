import httpClient from "../http-common.js";

const list = () => {
    return httpClient.get('/api/customer/');
}

const get = id => {
    return httpClient.get(`/api/customer/${id}`);
}

const update = data => {
    return httpClient.put('/api/customer/', data);
}

const remove = id => {
    return httpClient.delete(`/api/customer/${id}`);
}

const login = data => {
    return httpClient.post('/api/customer/login', data);
}

const register = data => {
    return httpClient.post('/api/customer/register', data);
}

export default { list, get, update, remove, register, login};