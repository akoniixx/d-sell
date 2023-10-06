export interface StoreEntity {
  customerCompanyId: string;
  customerImage?: string;
  customerName: string;
  customerNo?: string;
  zone: string;
  isChecked?: boolean;
  usedAmount: string;
  balance: string;
  customerId?: number;
}

export interface ZoneEntity {
  zoneId: string;
  zoneName: string;
  company?: string;
}
