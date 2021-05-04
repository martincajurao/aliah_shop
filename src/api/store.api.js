import Axios from '@/plugins/axios';
const resource = '/stores';

export const  apiCreateUser = (payload) => Axios.post(`register`, payload)
export const  apiGetAllUsers = () => Axios.get(`${resource}`)
export const  apiGetUser = (id) => Axios.get(`${resource}/${id}`)
export const  apiDeleteUser = (id) => Axios.delete(`${resource}/${id}`)
export const  apiUpdateUser = (payload, id) => Axios.put(`${resource}/${id}`, payload)
