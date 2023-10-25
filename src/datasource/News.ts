import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";
import { PinedNewsEntity } from "../entities/NewsEntity";

const baseUrl = `${BASE_URL}/sellcoda-news`;
// const baseUrl = `http://localhost:3002`;

const getNewsList = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/news`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getNewsById = async (newsId: string) => {
  return await httpClient
    .get(`${baseUrl}/news/get`, { params: { newsId } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const createNews = async (data: FormData) => {
  return await httpClient
    .post(`${baseUrl}/news/create`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateNews = async (data: FormData) => {
  return await httpClient
    .post(`${baseUrl}/news/update`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const deleteNews = async (data: { newsId: string; updateBy: string }) => {
  return await httpClient
    .delete(`${baseUrl}/news`, { data })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getPinedNewsList = async (params: { company: string }) => {
  return await httpClient
    .get(`${baseUrl}/pined`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updatePinedNewsList = async (data: { newsList: PinedNewsEntity[]; createBy: string }) => {
  return await httpClient
    .post(`${baseUrl}/pined/update`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export {
  getNewsList,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getPinedNewsList,
  updatePinedNewsList,
};
