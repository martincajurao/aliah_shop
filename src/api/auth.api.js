import Axios from '@/plugins/axios';
const resource = '/stores';

export const  apiLogin = (payload) => Axios.post(`login`, payload)
export const  apiRegister = (payload) => Axios.post(`register`, payload)

export const  apiGetStoreSettings = () => Axios.get(`stores`)
export const  apiUpdateStore = (payload, id) => Axios.post(`${resource}/${id}`, payload)