import axios from "axios";

export const NAV_DEV_URL = "https://api-dev-sellcoda.iconkaset.com/nav";
export const NAV_URL =
  process.env.NODE_ENV === "development" ? NAV_DEV_URL : process.env.REACT_APP_NAV_URL_HOST;
export const DEV_URL = "https://sellcoda-api-dev.iconkaset.com";
export const BASE_URL =
  process.env.NODE_ENV === "development" ? DEV_URL : process.env.REACT_APP_URL_HOST;
export const DEV_ICONKASET_URL = "https://iconkasetshop-api-dev.iconkaset.com";
export const BASE_ICONKASET_URL =
  process.env.NODE_ENV === "development"
    ? DEV_ICONKASET_URL
    : process.env.REACT_APP_ICONKASET_URL_HOST;

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

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
    return error;
  },
);

export const httpClient = axios;

export const intanceAuth = axios.create({
  baseURL: BASE_URL,
});
