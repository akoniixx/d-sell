export interface StoreEntity {
  customerCompanyId: string;
  customerImage?: string;
  customerName: string;
  zone: string;
  isChecked?: boolean;
}

export interface ZoneEntity {
  zoneId: string;
  zoneName: string;
  company?: string;
}
