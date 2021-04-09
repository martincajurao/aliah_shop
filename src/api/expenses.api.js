import Axios from '@/plugins/axios';
const resource = '/expenses';

export const  apiCreateExpenses = (payload) => Axios.post(`${resource}`, payload)
export const  apiUpdateExpenses = (payload, id) => Axios.put(`${resource}/${id}`, payload)
export const  apiGetAllExpenses = () => Axios.get(`${resource}`)

export const  apiSearchExpensesReport = (from, to) => Axios.get(`search_expenses/?from=${from}&to=${to}`)
export const  apiPrintExpensesReport = ( payload) => {
    return Axios.post(`${resource}/expenses_print`, payload,)
}   