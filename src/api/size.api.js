import Axios from '@/plugins/axios';
const resource = '/sizes';

export const  apiCreateSize = (payload) => Axios.post(`${resource}`, payload)
export const  apiUpdateSize = (payload, id) => Axios.put(`${resource}/${id}`, payload)
export const  apiGetAllSizes = () => Axios.get(`${resource}`)
export const  apiGetSize = (id) => Axios.get(`${resource}/${id}`)
export const  apiDeleteSize = (id) => Axios.delete(`${resource}/${id}`)