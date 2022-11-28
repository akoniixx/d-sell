import locale from "antd/es/date-picker/locale/th_TH";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import styled from "styled-components";
import AntDate from "./ExtendDayjs";

const newLocale = {
  ...locale,
  lang: {
    ...locale.lang,
    dateFormat: "D/M/BBBB",
    yearFormat: "BBBB",
    dateTimeFormat: "D/M/BBBB HH:mm:ss",
  },
};
const AntDatePicker = styled(AntDate)`
  .ant-picker-clear {
    margin-right: 12px;
  }
`;

interface Props {
  onChange?: () => void;
  timer?: boolean;
  value?: Dayjs;
  picker?: "year";
  disabled?: boolean;
  dateValue?: Dayjs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.Ref<any> | undefined;
  enablePast?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}
function DatePicker({
  onChange,
  value,
  picker,
  enablePast = false,
  style,
  placeholder,
  ...props
}: Props): JSX.Element {
  console.log(newLocale);
  return (
    <AntDatePicker
      locale={newLocale}
      placeholder={placeholder}
      picker={picker}
      value={value}
      onChange={onChange}
      suffixIcon={false}
      style={{
        height: 40,
        width: "100%",
        fontFamily: "Sarabun",
        ...style,
      }}
      disabledDate={(current) => {
        if (enablePast) {
          return !enablePast;
        } else {
          return current && current.isBefore(dayjs().subtract(1, "day"));
        }
      }}
      format={picker === "year" ? "BBBB" : "DD/MM/BBBB"}
      {...props}
    />
  );
}

export default DatePicker;
