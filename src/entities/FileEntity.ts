export interface FileEntity {
  createAt: string;
  filePath: string;
  isDeleted: boolean;
  updateAt: string;
}

export interface OrderFileEntity extends FileEntity {
  orderFileId: string;
  orderId: string;
}
