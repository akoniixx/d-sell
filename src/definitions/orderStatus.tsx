export type OrderStatusKey =
  | "WAIT_APPROVE_ORDER"
  | "WAIT_CONFIRM_ORDER"
  | "CONFIRM_ORDER"
  | "OPEN_ORDER"
  | "IN_DELIVERY"
  | "DELIVERY_SUCCESS"
  | "SHOPAPP_CANCLE_ORDER"
  | "COMPANY_CANCLE_ORDER"
  | "REJECT_ORDER";

export type OrderPaymentMethodName = "CASH" | "CREDIT";

export type OrderPaymentStatusKey = "WAITING_PAID" | "PAID";

export const ORDER_STATUS = {
  WAIT_APPROVE_ORDER: {
    name_default: "รออนุมัติคำสั่งซื้อ",
    name_icpl: "รออนุมัติคำสั่งซื้อ",
    name_icpi: "รออนุมัติคำสั่งซื้อ",
    name_icpf: "รออนุมัติคำสั่งซื้อ",
    color: "#9B51E0",
  },
  WAIT_CONFIRM_ORDER: {
    name_default: "รอยืนยันคำสั่งซื้อ",
    name_icpl: "รอยืนยันคำสั่งซื้อ",
    name_icpi: "รอยืนยันคำสั่งซื้อ",
    name_icpf: "รอยืนยันคำสั่งซื้อ",
    color: "#FFC804",
  },
  CONFIRM_ORDER: {
    name_default: "ยืนยันคำสั่งซื้อแล้ว",
    name_icpl: "ยืนยันคำสั่งซื้อแล้ว",
    name_icpi: "ยืนยันคำสั่งซื้อแล้ว",
    name_icpf: "ยืนยันคำสั่งซื้อแล้ว",
    color: "#0068F4",
  },
  OPEN_ORDER: {
    name_default: "เปิดรายการคำสั่งซื้อแล้ว",
    name_icpl: "เปิดรายการคำสั่งซื้อแล้ว",
    name_icpi: "เปิดรายการคำสั่งซื้อแล้ว",
    name_icpf: "เปิดรายการคำสั่งซื้อแล้ว",
    color: "#2ED477",
  },
  IN_DELIVERY: {
    name_default: "กำลังจัดส่ง",
    name_icpl: "กำลังจัดส่ง",
    name_icpi: "รอขึ้นสินค้า",
    name_icpf: "รอขึ้นสินค้า",
    color: "#2ED477",
  },
  DELIVERY_SUCCESS: {
    name_default: "ลูกค้ารับสินค้าแล้ว",
    name_icpl: "ลูกค้ารับสินค้าแล้ว",
    name_icpi: "ขึ้นสินค้าเรียบร้อยแล้ว",
    name_icpf: "ขึ้นสินค้าเรียบร้อยแล้ว",
    color: "#2ED477",
  },
  SHOPAPP_CANCLE_ORDER: {
    name_default: "ยกเลิกคำสั่งซื้อโดยร้านค้า",
    name_icpl: "ยกเลิกคำสั่งซื้อโดยร้านค้า",
    name_icpi: "ยกเลิกคำสั่งซื้อโดยร้านค้า",
    name_icpf: "ยกเลิกคำสั่งซื้อโดยร้านค้า",
    color: "#F46363",
  },
  COMPANY_CANCLE_ORDER: {
    name_default: "ยกเลิกคำสั่งซื้อโดยบริษัท",
    name_icpl: "ยกเลิกคำสั่งซื้อโดยบริษัท",
    name_icpi: "ยกเลิกคำสั่งซื้อโดยบริษัท",
    name_icpf: "ยกเลิกคำสั่งซื้อโดยบริษัท",
    color: "#F46363",
  },
  REJECT_ORDER: {
    name_default: "ไม่อนุมัติคำสั่งซื้อ",
    name_icpl: "ไม่อนุมัติคำสั่งซื้อ",
    name_icpi: "ไม่อนุมัติคำสั่งซื้อ",
    name_icpf: "ไม่อนุมัติคำสั่งซื้อ",
    color: "#F46363",
  },
};

export const ORDER_PAYMENT_STATUS = {
  WAITING_PAID: {
    name_default: "ยังไม่ได้ชำระเงิน",
    color: "#FFC804",
  },
  PAID: {
    name_default: "ชำระเงินแล้ว",
    color: "#FFC804",
  },
};

export const ORDER_PAYMENT_METHOD_NAME = {
  CASH: "เงินสด",
  CREDIT: "เครดิต",
};
