import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        console.error(error)
    }
)

axiosInstance.interceptors.response.use(
    response => response,
    (error) => {
        if(error.response.status === 403){
            const currentPath = window.location.pathname;
            if (currentPath !== '/notice') {
                window.location.href = '/login';
                localStorage.clear()
                sessionStorage.clear()
            }
        }
        console.error(error)
    }
)
