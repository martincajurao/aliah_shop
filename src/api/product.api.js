import Axios from '@/plugins/axios';
const resource = '/products';

export const  apiCreateProduct = (payload) => Axios.post(`${resource}`, payload)
export const  apiUpdateProduct = (payload, id) => Axios.post(`${resource}/${id}`, payload)
export const  apiGetAllProducts = () => Axios.get(`${resource}`)
export const  apiGetProduct = (id) => Axios.get(`${resource}/${id}`)
export const  apiSearchProduct = (query) => Axios.get(`${resource}-search/?search=${query}`)
export const  apiSearchBarcode = (query) => Axios.get(`${resource}-find/?barcode=${query}`)
export const  apiDeleteProduct = (id) => Axios.delete(`${resource}/${id}`)
export const  apiGenerateBarcode = (payload) => Axios.post(`/barcode` , payload)