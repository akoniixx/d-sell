import axios from "axios";

export const BASE_URL = "https://api-dev-sellcoda.iconkaset.com";

axios.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token") || "";

  const newConfig = {
    ...config,
    headers: {
      accept: "application/json",
      Authorization: token ? `Bearer ` + JSON.parse(token) : "",
    },
  };

  return newConfig;
});

export const httpClient = axios;

export const intanceAuth = axios.create({
  baseURL: BASE_URL,
});
