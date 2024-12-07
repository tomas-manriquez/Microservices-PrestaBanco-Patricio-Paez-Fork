import httpClient from "../http-common.js";

const list = () => {
    return httpClient.get('/api/debt/');
}

const get = id => {
    return httpClient.get(`/api/debt/${id}`);
}

const update = data => {
    return httpClient.put('/api/debt/', data);
}

const remove = id => {
    return httpClient.delete(`/api/debt/${id}`);
}

export default { list, get, update, remove};