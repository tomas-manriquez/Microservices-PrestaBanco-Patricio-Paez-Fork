import httpClient from "../http-common.js";

const listbyuser = id => {
    return httpClient.get(`/api/request/user/${id}`);
}

const get = id => {
    return httpClient.get(`/api/request/${id}`);
}

const save = data => {
    return httpClient.post(`/api/request/`, data);
}

const update = data => {
    return httpClient.put('/api/request/', data);
}

const remove = id => {
    return httpClient.delete(`/api/request/${id}`);
}

export default { listbyuser, save, get, update, remove};