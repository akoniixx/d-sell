import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";
import { OrderPaymentStatusKey, OrderStatusKey } from "../definitions/orderStatus";

const baseUrl = `${BASE_URL}/cart`;

const getOrders = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/order`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getOrderDetail = async (id: string) => {
  return await httpClient
    .get(`${baseUrl}/order/${id}`, { params: { id } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateOrderStatus = async (data: {
  orderId: string;
  status?: OrderStatusKey;
  paidStatus?: OrderPaymentStatusKey;
  cancleRemark?: string;
  updateBy: string;
}) => {
  return await httpClient
    .post(`${baseUrl}/order/update-order-status`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getOrders, getOrderDetail, updateOrderStatus };