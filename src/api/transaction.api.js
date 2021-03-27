import Axios from '@/plugins/axios';
const resource = '/transactions';

export const  apiCreateTransaction = (payload) => Axios.post(`${resource}`, payload)
export const  apiGetAllTransactions = () => Axios.get(`${resource}`)
export const  apiSearchTransaction = (query) => Axios.get(`${resource}-search/?search=${query}`)
export const  apiChartTransaction = () => Axios.get(`/depota`)


