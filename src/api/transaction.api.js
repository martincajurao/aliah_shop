import Axios from '@/plugins/axios';
const resource = '/transactions';

export const  apiCreateTransaction = (payload) => Axios.post(`${resource}`, payload)
export const  apiGetAllTransactions = () => Axios.get(`${resource}`)
export const  apiSearchTransaction = (query) => Axios.get(`${resource}-search/?search=${query}`)
export const  apiSearchSalesReport = (from, to) => Axios.get(`search_sales/?from=${from}&to=${to}`)
export const  apiChartTransaction = () => Axios.get(`/depota`)
export const  apiTodaysSale = () => Axios.get(`/todays_sale`)


//exports
export const  apiGenerateRecieptPdf = ( payload) => {
    return Axios.post(`${resource}/reciept_pdf`, payload, {responseType: 'blob'})
}
export const  apiPrintReciept = ( payload) => {
    return Axios.post(`${resource}/reciept_print`, payload,)
}