import httpClient from "../http-common.js";

const list = () => {
    return httpClient.get('/api/executive/');
}

const save = data => {
    return httpClient.post("/api/executive/", data);
}

const get = id => {
    return httpClient.get(`/api/executive/${id}`);
}

const update = data => {
    return httpClient.put('/api/executive/', data);
}

const remove = id => {
    return httpClient.delete(`/api/executive/${id}`);
}

const login = data => {
    return httpClient.post('/api/executive/login', data);
}

export default { list, save, get, update, remove, login};