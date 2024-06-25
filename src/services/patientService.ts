import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

const responseBody = (response: AxiosResponse) => response.data;

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
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(responseBody),
    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(responseBody),
}

const Patient = {
    list: (params?: URLSearchParams) => requests.get('Patient', params),
    getPatientById: (id: string) => requests.get(`Patient/${id}`),
    addPatientRecord: (values: any) => requests.post('Patient', values),
    updatePatientRecord: (id: string, values: any) => requests.put(`Patient/${id}`, values),
    removePatient: (id: string) => requests.del(`Patient/${id}`)
}


const patientService = {
    Patient
}

export default patientService;