import Axios from '@/plugins/axios';
const resource = '/charts';
export const  getChartData = () => Axios.get(`${resource}`)
