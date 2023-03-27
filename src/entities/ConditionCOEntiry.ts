export interface ConditionCOEntiry {
  creditMemoConditionId: string;
  creditMemoConditionName: string;
  company: string;
  startDate: string;
  endDate: string;
  creditMemoConditionStatus: boolean;
  comment: string;
  creditMemoConditionProduct: creditMemoConditionProductEntity[];
  createBy: string;
  updateBy: string;
  creditMemoConditionShop: creditMemoConditionShop[];
}

export interface CreateConditionCOEntiry {
  creditMemoConditionName: string;
  company: string;
  startDate: string;
  endDate: string;
  creditMemoConditionStatus: boolean;
  comment: string;
  creditMemoConditionProduct: creditMemoConditionProductEntity[];
  createBy: string;
  updateBy: string;
  creditMemoConditionShop: creditMemoConditionShop[];
}
export interface creditMemoConditionProductEntity {
  creditMemoConditionProductId: string;
  creditMemoConditionId: string;
  productId: string;
  discountAmount: number;
}
export interface creditMemoConditionShop {
  customerCompanyId: number;
  customerName: string;
  zone: string;
}

export const creditMemoConditionProductEntity_INIT: creditMemoConditionProductEntity = {
  creditMemoConditionProductId: "",
  creditMemoConditionId: "",
  productId: "",
  discountAmount: 0,
};

export const creditMemoConditionShop_INIT: creditMemoConditionShop = {
  customerCompanyId: 0,
  customerName: "",
  zone: "",
};

export const CreateConditionCOEntiry_INIT: CreateConditionCOEntiry = {
  creditMemoConditionName: "",
  company: "",
  startDate: "",
  endDate: "",
  creditMemoConditionStatus: true,
  comment: "",
  creditMemoConditionProduct: [creditMemoConditionProductEntity_INIT],
  createBy: "",
  updateBy: "",
  creditMemoConditionShop: [creditMemoConditionShop_INIT],
};