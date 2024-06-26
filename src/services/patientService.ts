import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Bundle, PatientModel } from '../models/patient';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

const responseBody = <T>(response: {data: T}) => response.data;

axios.interceptors.response.use(async response => {
    if(import.meta.env.DEV) await sleep();
    return response;
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;

    switch(status){
        case 400: 
            if(data.errors){
                const modelStateErrors: string[] = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;  
        case 403:
            toast.error('You are not allowed here');
            break;
        default:
            break;  
    }
    return Promise.reject(error.response);
})

const requests = {
    get: <T>(url: string): Promise<T> => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Patient = {
    list: () => requests.get<Bundle<PatientModel>>('/Patient'),
    getPatientById: (id: string) => requests.get<PatientModel>(`/Patient/${id}`),
    addPatientRecord: (values: any) => requests.post('/Patient', values),
    updatePatientRecord: (id: string, values: any) => requests.put(`/Patient/${id}`, values),
    removePatient: (id: string) => requests.del(`/Patient/${id}`),
    searchPatients: (query: string): Promise<Bundle<PatientModel>> => {
      const queryParams = new URLSearchParams();
      if (query) {
        if (/^\d+$/.test(query)) {
            queryParams.append('id', query);
        } else {
            queryParams.append('name', query);
        }
      }
      return requests.get(`/Patient/search?${queryParams.toString()}`);
    },
}


const patientService = {
    Patient
}

export default patientService;