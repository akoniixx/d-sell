import { OrderStatusKey, ORDER_STATUS } from "../definitions/orderStatus";

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
