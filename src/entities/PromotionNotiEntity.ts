export interface PromotionNotiList {
  count: number;
  data: PromotionNoti[];
}
export interface CreatePromotionNoti {
  promotionId: string;
  company: string;
  promotionNotiSubject: string;
  promotionNotiDetail: string;
  isShowSaleApp: boolean;
  isShowShopApp: boolean;
  isSendNow: boolean;
  startDate: string;
  executeTime: string;
  createBy: string;
  createdAt: string;
}
export interface PromotionNoti extends CreatePromotionNoti {
  promotionNotiId: string;
  isFromPromotionMaster: boolean;
  status: string;
  updateBy: string;
  updatedAt: string;
  promotionName: string;
  promotionCode: string;
}

export interface SelectPromotionList {
  promotionId: string;
  promotionName: string;
  startDate: string;
  isShowSaleApp: boolean;
  isShowShopApp: boolean;
  promotionNotiDetail: string;
  promotionNotiSubject: string;
}
