export enum PromotionType {
  DISCOUNT_NOT_MIX = "DISCOUNT_NOT_MIX",
  FREEBIES_NOT_MIX = "FREEBIES_NOT_MIX",
  DISCOUNT_MIX = "DISCOUNT_MIX",
  FREEBIES_MIX = "FREEBIES_MIX",
  OTHER = "OTHER",
}

export const PROMOTION_TYPE_NAME: any = {
  DISCOUNT_NOT_MIX: "ส่วนลดแบบไม่คละ SKU",
  FREEBIES_NOT_MIX: "ของแถมแบบไม่คละ SKU",
  DISCOUNT_MIX: "ส่วนลดแบบคละ SKU",
  FREEBIES_MIX: "ของแถมแบบคละ SKU",
  OTHER: "อื่น ๆ",
};

export const PromotionGroup = {
  NOT_MIX: [PromotionType.DISCOUNT_NOT_MIX, PromotionType.FREEBIES_NOT_MIX],
  MIX: [PromotionType.DISCOUNT_MIX, PromotionType.FREEBIES_MIX, PromotionType.OTHER],
};

export enum PromotionGroupOption {
  UNIT = "Quantity",
  WEIGHT = "Size",
}

export const PROMOTION_GROUP_OPTION_NAME = {
  UNIT: "จำนวน",
  WEIGHT: "น้ำหนัก/ปริมาตร",
};
