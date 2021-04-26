import Axios from '@/plugins/axios';
const resource = '/products';

export const  apiCreateProduct = (payload) => Axios.post(`${resource}`, payload)
export const  apiUpdateProduct = (payload, id) => Axios.post(`${resource}/${id}`, payload)
export const  apiGetAllProducts = () => Axios.get(`${resource}`)
export const  apiGetFeaturedProducts = () => Axios.get(`${resource}-featured`)
export const  apiGetAllAssets = () => Axios.get(`assets`)
export const  apiGetAllAssetsSales = () => Axios.get(`assets-sales`)
export const  apiGetProduct = (id) => Axios.get(`${resource}/${id}`)
export const  apiSearchProduct = (query) => Axios.get(`${resource}-search/?search=${query}`)
export const  apiSearchBarcode = (query) => Axios.get(`${resource}-find/?barcode=${query}`)
export const  apiDeleteProduct = (id) => Axios.delete(`${resource}/${id}`)
export const  apiGenerateBarcode = (payload) => Axios.post(`/barcode` , payload)
export const  apiSearchAssetsSalesReport = (from, to) => Axios.get(`search_assets_sales/?from=${from}&to=${to}`)
export const  apiPrintAssetsReport = ( payload) => {
    return Axios.post(`/print_assets_report`, payload,)
} 
export const  apiPrintAssetsSalesReport = ( payload) => {
    return Axios.post(`/print_assets_sales`, payload,)
} 