import Axios from '@/plugins/axios';
const resource = '/colors';

export const  apiCreateColor = (payload) => Axios.post(`${resource}`, payload)
export const  apiUpdateColor = (payload, id) => Axios.put(`${resource}/${id}`, payload)
export const  apiGetAllColors = () => Axios.get(`${resource}`)
export const  apiGetColor = (id) => Axios.get(`${resource}/${id}`)
export const  apiDeleteColor = (id) => Axios.delete(`${resource}/${id}`)