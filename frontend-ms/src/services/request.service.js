import httpClient from "../http-common.js";

const list = () => {
    return httpClient.get('/api/request/');
}

const get = id => {
    return httpClient.get(`/api/request/${id}`);
}

const update = data => {
    return httpClient.put('/api/request/', data);
}

const remove = id => {
    return httpClient.delete(`/api/request/${id}`);
}

const save = data => {
    return httpClient.post('/api/request/', data);
}

const autoCheck = data => {
    return httpClient.post('/api/request/autocheck', data);
}

export default { list, get, update, remove, autoCheck, save};