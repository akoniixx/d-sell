export const inputNumberValidator = ({ min, message }: { min?: number; message?: string }) => {
  const minValue = min ? min : 1;
  const defaultMessage = `กรุณาระบุจำนวนที่ไม่ต่ำกว่า ${minValue}`;
  const errMessage = message || defaultMessage;
  return {
    message: errMessage,
    validator(rule: any, value: any, callback: any) {
      if (parseInt(value) < minValue) {
        throw new Error();
      }
    },
  };
};

export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value);
};
