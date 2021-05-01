import Axios from '@/plugins/axios';

export const  apiLogin = (payload) => Axios.post(`login`, payload)
export const  apiRegister = (payload) => Axios.post(`register`, payload)
