import { atom } from "recoil";

const customerCompanyState = atom({
  key: "customerCompany",
  default: {
    data: [],
    specialPrice: [],
    specialPriceCount: [],
  },
});

export default customerCompanyState;
