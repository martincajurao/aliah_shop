import Axios from '@/plugins/axios';
const resource = '/categories';

export const  apiCreateCategory = (payload) => Axios.post(`${resource}`, payload)
export const  apiUpdateCategory = (payload, id) => Axios.put(`${resource}/${id}`, payload)
export const  apiGetAllCategory = () => Axios.get(`${resource}`)
export const  apiGetCategory = (id) => Axios.get(`${resource}/${id}`)
export const  apiDeleteCategory = (id) => Axios.delete(`${resource}/${id}`)