import { PinPage } from "../definitions/news";

export interface NewsEntity {
  key?: string;
  newsId?: string;
  company?: string;
  topic?: string;
  image?: string;
  content?: string;
  isShowOnSaleApp?: boolean;
  isShowOnShopApp?: boolean;
  type?: string;
  publishTime?: Date;
  status?: string;
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface PinedNewsEntity {
  key?: string;
  pinedNewsId?: string;
  company?: string;
  newsId?: string;
  topic?: string;
  order?: number;
  page?: PinPage;
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
