import axios from "axios";
import { userStore } from "../zustand/userStore";

const API_BASE_URL = "http://localhost:8001";

const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})


instance.interceptors.request.use(function (config) {
    const { accessToken } = userStore.getState();

    if (accessToken) {
        config.headers['Authorization'] = `${accessToken}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


instance.interceptors.response.use(function (response) {
    return response;
}, async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const res = await axios.get('http://localhost:8001/auth/refresh', { withCredentials: true });
            const { accessToken } = res.data;
            userStore.getState().setAccessToken(accessToken);
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