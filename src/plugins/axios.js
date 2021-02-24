import axios from 'axios';
import {ADMIN_API} from '@/global/variables'

// const baseDomain = "http://127.0.0.1:8000";
// const baseDomain = "https://erp.checkmy.dev";
// const baseDomain = "http://qonvex.erp-electron";
const baseURL = `${ADMIN_API}/api`; // Incase of /api/v1;
//const baseURL = `${ADMIN_API}/api/admin/v1`; // Incase of /api/v1;

const httpClient = axios.create({
    baseURL,
});


export default httpClient;
