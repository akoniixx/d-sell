import { atom } from "recoil";

export interface PromotionState {
  promotion?: any;
}

const promotionState = atom({
  key: "promorion",
  default: {
    promotion: undefined,
  } as PromotionState,
});

export default promotionState;
