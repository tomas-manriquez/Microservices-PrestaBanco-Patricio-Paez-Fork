import httpClient from "../http-common.js";

const simulate = data => {
    return httpClient.post('/api/simulation/loan', data);
}


const totalcost = data => {
    return httpClient.post(`/api/simulation/total-cost`, data);
}

export default { simulate, totalcost};