export interface CreditMemoShopEntity {
  balance: number;
  createdAt: string;
  creditMemoId: string;
  creditMemoShopId: string;
  customerCompanyId: string | number;
  customerName: string;
  receiveAmount: number;
  updateBy?: string;
  updatedAt?: string;
  usedAmount?: number;
  zone: string;
}

export interface CreditMemoEntity {
  company: string;
  createBy: string;
  createdAt: string;
  creditMemoCode: string;
  creditMemoId: string;
  creditMemoName: string;
  creditMemoShop: CreditMemoShopEntity[];
  creditMemoStatus: boolean;
  isDeleted: boolean;
  remark?: string;
  updateBy?: string;
  updatedAt?: string;
}
