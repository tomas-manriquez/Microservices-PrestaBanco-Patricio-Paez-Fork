import httpClient from "../http-common.js";

const list = () => {
    return httpClient.get('/api/income/');
}

const get = id => {
    return httpClient.get(`/api/income/${id}`);
}

const update = data => {
    return httpClient.put('/api/income/', data);
}

const remove = id => {
    return httpClient.delete(`/api/income/${id}`);
}

export default { list, get, update, remove};