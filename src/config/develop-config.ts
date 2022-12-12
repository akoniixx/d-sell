import axios from "axios";

export const BASE_URL = "https://api-dev-sellcoda.iconkaset.com";

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token") || "";

    const newConfig = {
      ...config,
      headers: {
        accept: "application/json",
        Authorization: token ? `Bearer ` + JSON.parse(token) : "",
      },
    };

    return newConfig;
  },
  async (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      const url = window.location.href;
      const arr = url.split("/");
      const resultUrlHost = arr[0] + "//" + arr[2];

      window.location.href =
        "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" +
        resultUrlHost;
    }
    return Promise.reject(error);
  },
);

export const httpClient = axios;

export const intanceAuth = axios.create({
  baseURL: BASE_URL,
});
