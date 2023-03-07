export const setToArray = (set: Set<any>) => {
  return Array.from(set.values());
};

export const arrayToSet = (array: any[]) => {
  return new Set(array);
};

export const objArrayToObjArrayWithKey = (array: any[], keyPrefix?: string) => {
  return array.map((e, i) => ({ ...e, key: `${keyPrefix || ""}${i}` }));
};
