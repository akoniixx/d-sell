import color from "../resource/color";

export type NewsStatus = "PUBLISHED" | "WAITING" | "DRAFT" | "INACTIVE";
export type NewsType = "NEWS" | "INFO";
export type PinPage = "NEWS_PAGE" | "MAIN_PAGE";

export const newsStatus = {
  PUBLISHED: {
    key: "PUBLISHED",
    name: "เผยแพร่แล้ว",
    nickname: "ใช้งาน",
    color: color.success,
  },
  WAITING: {
    key: "WAITING",
    name: "รอเวลาเผยแพร่",
    nickname: "ใช้งาน",
    color: color.success,
  },
  DRAFT: {
    key: "DRAFT",
    name: "แบบร่าง",
    nickname: "แบบร่าง",
    color: color.warning,
  },
  INACTIVE: {
    key: "INACTIVE",
    name: "ปิดการใช้งาน",
    nickname: "ปิดการใช้งาน",
    color: color.error,
  },
};

export const newsTypes = {
  NEWS: {
    key: "NEWS",
    name: "ข่าวสาร",
  },
  INFO: {
    key: "INFO",
    name: "คลังความรู้",
  },
};
