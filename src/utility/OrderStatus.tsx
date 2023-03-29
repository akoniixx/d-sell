import { OrderStatusKey, ORDER_STATUS } from "../definitions/orderStatus";
import colors from "../resource/color";

export const getOrderStatus = (statusKey: OrderStatusKey, company: string) => {
  let name;
  switch (company) {
    case "ICPL":
      name = ORDER_STATUS[statusKey]?.name_icpl;
      break;
    case "ICPI":
      name = ORDER_STATUS[statusKey]?.name_icpi;
      break;
    case "ICPF":
      name = ORDER_STATUS[statusKey]?.name_icpf;
      break;
  }
  if (name) return name;
  return ORDER_STATUS[statusKey]?.name_default;
};

export const getSpecialRequestStatus = (statusKey: OrderStatusKey) => {
  let name, color;
  switch (statusKey) {
    case "WAIT_APPROVE_ORDER":
      name = "รออนุมัติ";
      color = colors.warning;
      break;
    case "REJECT_ORDER":
      name = "ไม่อนุมัติ";
      color = colors.Disable;
      break;
    // case "SHOPAPP_CANCEL_ORDER":
    // case "COMPANY_CANCEL_ORDER":
    //   name = "ถูกยกเลิก";
    //   color = colors.Disable;
    //   break;
    default:
      name = "อนุมัติ";
      color = colors.success;
      break;
  }
  return { name, color };
};
