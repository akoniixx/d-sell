import { atom } from "recoil";
import PromotionSettingEntity from "../entities/PromotionSettingEntity";
import { PromotionGroupOption } from "../definitions/promotion";
import { defaultFormat } from "moment";

export interface PromotionState {
  promotion?: PromotionSettingEntity;
  productGroup?: any;
  promotionGroupOption?: PromotionGroupOption;
}

const defaultState = {
  promotion: undefined,
  productGroup: undefined,
  promotionGroupOption: undefined,
} as PromotionState;

const promotionState = atom({
  key: "promotion",
  default: defaultState,
});

export default promotionState;
