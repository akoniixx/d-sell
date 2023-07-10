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
  cancelRemark?: string;
  updateBy: string;
}) => {
  return await httpClient
    .post(`${baseUrl}/order/update-order-status`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const submitToNav = async (data: { orderId: string; remark?: string; updateBy?: string }) => {
  return await httpClient
    .post(`${BASE_URL}/nav/sale-order`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const getPdfPo = async (id: string) => {
  return await httpClient
    .post(
      `${baseUrl}/report-document/report-pdf-po/${id}`,
      {},
      {
        responseType: "arraybuffer",
      },
    )
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getOrders, getOrderDetail, updateOrderStatus, submitToNav, getPdfPo };
