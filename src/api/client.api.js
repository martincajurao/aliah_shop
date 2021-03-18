import Axios from '@/plugins/axios';
const resource = '/clients';

export const  apiCreateClient = (payload) => Axios.post(`${resource}`, payload)
// export const  apiUpdateClient = (payload, id) => Axios.put(`${resource}/${id}`, payload)
export const  apiGetAllClients = () => Axios.get(`${resource}`)
export const  apiGetClient = (id) => Axios.get(`${resource}/${id}`)
export const  apiDeleteClient = (id) => Axios.delete(`${resource}/${id}`)
export const  apiUpdateClientData = (payload, id) => Axios.put(`${resource}/${id}`, payload)
