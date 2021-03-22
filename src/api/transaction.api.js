import Axios from '@/plugins/axios';
const resource = '/transactions';

export const  apiCreateTransaction = (payload) => Axios.post(`${resource}`, payload)

