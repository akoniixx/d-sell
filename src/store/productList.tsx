import { atom } from "recoil";

const productState = atom({
    key: 'productList',
    default: {
        page: 1,
        pageSize: 100,
        count: 0,
        data: []
    }
});

export default productState;