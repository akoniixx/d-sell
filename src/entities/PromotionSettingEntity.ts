import { PromotionGroupOption, PromotionType } from "../definitions/promotion";
import { ProductEntity } from "./PoductEntity";

export interface PromotionConditionEntity {
  quantity?: string;
  saleUnit?: string;
  saleUnitDiscount?: string;
  discountPrice?: string;
  freebies?: ProductEntity[];
}

export interface PromotionConditionGroupEntity {
  productId: string;
  condition?: PromotionConditionEntity[];
  productImage?: string;
  productName?: string;
  packSize?: string;
  unitPrice?: string;
  marketPrice?: string;
  saleUOMTH?: string;
  products?: ProductEntity[];
  conditionDiscount?: any;
  conditionFreebies?: any;
  detail?: string;
  typeMix?: string;
  size?: string;
}

export interface PromotionShopEntity {
  promotionShopId?: string;
  promotionId?: string;
  customerCompanyId?: number;
  customerNo?: number | string;
  customerName?: string;
  zone?: string;
}

export interface PromotionSettingHistory {
  promotionHistoryId: string;
  promotionId: string;
  action?: string;
  beforeValue?: string;
  afterValue?: string;
  promotionStatus?: boolean;
  createdAt?: string;
  createBy?: string;
}

interface PromotionSettingEntity {
  promotionId: string;
  company?: string;
  promotionCode?: string;
  promotionName?: string;
  promotionType: PromotionType;
  startDate?: string;
  endDate?: string;
  fileMemoPath?: string;
  promotionImageFirst?: string;
  promotionImageSecond?: string;
  referencePromotion?: string[];
  comment?: string;
  promotionStatus?: boolean;
  isDraft?: boolean;
  isDelete?: boolean;
  conditionDetail?: PromotionConditionGroupEntity[];
  createdAt?: string;
  updatedAt?: string;
  createBy?: string;
  updateBy?: string;
  promotionShop?: PromotionShopEntity[];
  isShowPromotion: boolean;
  isShowSaleApp?: boolean;
  isShowShopApp?: boolean;
  promotionDetail?: string;
  promotionSubject?: string;
}

export default PromotionSettingEntity;
