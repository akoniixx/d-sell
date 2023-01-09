import { TimePicker as AntdTimePicker } from "antd";
import locale from "antd/es/date-picker/locale/th_TH";
import dayjs, { Dayjs } from "dayjs";
import moment, { Moment } from "moment";
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
  disabledDate?: (current: Dayjs) => boolean;
}
function DatePicker({
  onChange,
  value,
  picker,
  enablePast = false,
  style,
  placeholder,
  disabledDate,
  ...props
}: Props): JSX.Element {
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
      disabledDate={disabledDate ? disabledDate : (current) => {
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

interface RangeProps {
  onChange?: (dates: any, dateString: [string, string]) => void;
  timer?: boolean;
  value?: [Dayjs, Dayjs];
  picker?: "year";
  disabled?: boolean;
  dateValue?: Dayjs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.Ref<any> | undefined;
  enablePast?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  allowEmpty?: [boolean, boolean];
}
function RangePicker({
  onChange,
  value,
  picker,
  enablePast = false,
  style,
  placeholder,
  ...props
}: RangeProps): JSX.Element {
  return (
    <AntDatePicker.RangePicker
      locale={newLocale}
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

interface TimeProps {
  onChange?: () => void;
  timer?: boolean;
  value?: Moment;
  disabled?: boolean;
  dateValue?: Dayjs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.Ref<any> | undefined;
  placeholder?: string;
  style?: React.CSSProperties;
  showNow?: boolean;
  allowClear?: boolean;
  disabledTime?: (date: Moment) => any
}
function TimePicker({
  onChange,
  value,
  style,
  placeholder,
  showNow = false,
  disabledTime,
  ...props
}: TimeProps): JSX.Element {
  return (
    <AntdTimePicker
      locale={newLocale}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      suffixIcon={false}
      style={{
        height: 40,
        width: "100%",
        fontFamily: "Sarabun",
        ...style,
      }}
      format={"HH:mm"}
      showNow={showNow}
      disabledTime={disabledTime}
      {...props}
    />
  );
}

export default DatePicker;
export { RangePicker, TimePicker }
