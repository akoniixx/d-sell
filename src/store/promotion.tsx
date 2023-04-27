import { atom } from "recoil";
import PromotionSettingEntity from "../entities/PromotionSettingEntity";

export interface PromotionState {
  promotion?: PromotionSettingEntity;
}

const promotionState = atom({
  key: "promorion",
  default: {
    promotion: undefined,
  } as PromotionState,
});

export default promotionState;
