import axios from "axios";
import { userStore } from "../zustand/userStore";

const instance = axios.create({
    baseURL: "http://localhost:8001",
})


instance.interceptors.request.use(function (config) {
    const accessToken = userStore().accessToken;

    if (accessToken) {
        instance.defaults.headers.common['Authorization'] = accessToken
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


instance.interceptors.response.use(function (response) {
    return response;
}, async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const res = await axios.get('http://localhost:8001/auth/refresh', { withCredentials: true });
            console.log(res)
            return instance(originalRequest);
        } catch (err) {
            window.location.href = "/login";
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
}

);

export default instance