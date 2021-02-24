import Axios from '@/plugins/axios';
const status = '/status';

export const  apiCreateStatus = (payload) => Axios.post(`${status}`, payload)
export const  apiUpdateStatus = (payload, id) => Axios.put(`${status}/${id}`, payload)
export const  apiGetAllStatus = (query) => Axios.get(`${status}/?${query}`)
export const  apiGetStatus = (id) => Axios.get(`${status}/${id}`)
export const  apiDeleteStatus = (id) => Axios.delete(`${status}/${id}`)
export const  apiUpdateStatusStatus = (payload) => Axios.post(`${status}/update-status`, payload)
