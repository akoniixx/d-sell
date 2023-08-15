import { atom } from "recoil";
import { ProductEntity } from "../entities/PoductEntity";

interface ProductState {
  page: number;
  pageSize: number;
  count: number;
  data: ProductEntity[];
  allData: ProductEntity[];
  freebies: ProductEntity[];
}

const productState = atom<ProductState>({
  key: "productList",
  default: {
    page: 1,
    pageSize: 100,
    count: 0,
    data: [],
    allData: [],
    freebies: [],
  },
});

export default productState;
