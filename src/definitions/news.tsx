import color from "../resource/color";

export type NewsStatus = "PUBBLISHED" | "TO_BE_PUBLISHED" | "DRAFT" | "CLOSED";
export type NewsType = "NEWS" | "INFO";

export const newsStatus = {
  PUBBLISHED: {
    key: "PUBBLISHED",
    name: "เผยแพร่แล้ว",
    nickname: "ใช้งาน",
    color: color.success,
  },
  TO_BE_PUBLISHED: {
    key: "TO_BE_PUBLISHED",
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
  CLOSED: {
    key: "CLOSED",
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
