import Axios from '@/plugins/axios';
const resource = '/products';

export const  apiCreateProduct = (payload) => Axios.post(`${resource}`, payload)
export const  apiUpdateProduct = (payload, id) => Axios.post(`${resource}/${id}`, payload)
export const  apiGetAllProducts = () => Axios.get(`${resource}`)
export const  apiGetProduct = (id) => Axios.get(`${resource}/${id}`)
export const  apiDeleteProduct = (id) => Axios.delete(`${resource}/${id}`)