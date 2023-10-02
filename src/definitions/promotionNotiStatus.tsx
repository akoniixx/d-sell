export const PromotionNotiStatus = [
  { key: "WAITING", value: "WAITING", label: "รอแจ้งเตือน" },
  { key: "DONE", value: "DONE", label: "เสร็จสิ้น" },
  { key: "CANCEL", value: "CANCEL", label: "ยกเลิก" },
];

export const mapPromotionNotiStatus: any = {
  WAITING: "รอแจ้งเตือน",
  DONE: "เสร็จสิ้น",
  CANCEL: "ยกเลิก",
};
export const mapPromotionNotiStatusColor: any = {
  WAITING: "warning",
  DONE: "success",
  CANCEL: "error",
};
