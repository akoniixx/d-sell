import { CaretDownOutlined } from "@ant-design/icons";
import React from "react";
import color from "../../resource/color";
import { AntSelectCustom } from "./Select";
interface Props {
  data: {
    key: string;
    value?: string;
    label?: string;
  }[];
  onChange?: (v: any) => void;
  setValue?: (value: any) => void;
  style?: React.CSSProperties;
  defaultValue?: string | number;
  value?: string | number;
  disabled?: boolean;
  edit?: boolean;
  placeholder?: string;
  labelInValue?: boolean;
  onSearch?: (value: string) => void;
  filterOption?: boolean;
  notFoundContent?: JSX.Element | null;
  mode?: string;
  allowClear?: boolean;
}
export default function SelectMultiple({
  data = [],
  onChange,
  setValue,
  defaultValue,
  value,
  disabled = false,
  placeholder = "กรุณาเลือก",
  style,
  ...props
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <AntSelectCustom
      {...props}
      open={open}
      mode='multiple'
      onClick={() => {
        setOpen(!open);
      }}
      options={data}
      dropdownStyle={{ fontFamily: "Sarabun" }}
      onChange={(e) => {
        onChange?.(e);
        setValue?.(e);
      }}
      style={style}
      placeholder={placeholder}
      suffixIcon={
        <CaretDownOutlined
          onClick={() => {
            setOpen(!open);
          }}
          style={{
            color: color.Text1,
            fontSize: "20px",
          }}
        />
      }
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
}
