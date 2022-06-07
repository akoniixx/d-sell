import axios from 'axios'

export const BASE_URL = `https://sellcoda-bo-dev.iconkaset.com/api`;

axios.interceptors.request.use(async(config:any)=>{
    const token = "token"
    if (token != null) {
        config.headers["X-Access-Token"] = token
    }
    return config
})

export const httpClient = axios

export const intanceAuth = axios.create({
    baseURL: BASE_URL,
})
