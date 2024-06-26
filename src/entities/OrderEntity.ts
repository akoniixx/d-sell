import {
  OrderDeliveryDestKey,
  OrderPaymentMethodName,
  OrderPaymentStatusKey,
  OrderStatusKey,
} from "../definitions/orderStatus";
import { ProductEntity } from "./PoductEntity";

export interface OrderEntity {
  cancelRemark?: boolean;
  cashDiscount?: number;
  coDiscount?: number;
  company: string;
  createAt: string;
  customerCompanyId: number | string;
  customerName?: string;
  customerNo?: string;
  deliveryAddress: string;
  deliveryDest?: OrderDeliveryDestKey;
  deliveryRemark: string;
  discount?: number;
  isUseCOD?: boolean;
  navNo?: string;
  numberPlate?: string;
  orderId: string;
  orderNo?: string;
  orderProducts?: ProductEntity[];
  paidStatus?: OrderPaymentStatusKey;
  paymentMethod?: OrderPaymentMethodName;
  price?: number;
  saleCoRemark?: string;
  soNo?: string;
  specialRequestDiscount?: number;
  specialRequestRemark?: string;
  status: OrderStatusKey;
  totalDiscount?: number;
  totalPrice?: number;
  updateAt?: string;
  updateBy?: string;
  userShopId?: string | number;
  userShopName?: string;
  userStaffId?: string;
  userStaffName?: string;
  customerZone?: string;
  vat: number;
  vatPercentage: number;
}
