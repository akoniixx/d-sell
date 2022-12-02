import { Spin } from "antd";
import type { SelectProps } from "antd/es/select";
import React, { useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import Select from "./Select";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<
    {
      key: string;
      value?: string;
      label?: string;
    }[]
  >;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<
    {
      key: string;
      value?: string;
      label?: string;
    }[]
  >([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      data={options}
    />
  );
}

interface Props extends DebounceSelectProps {
  onChange?: (value: string) => void;
  value?: any;
  placeholder?: string;
  style?: React.CSSProperties;
}
function SelectFetching({ onChange, value, fetchOptions, placeholder }: Props) {
  return (
    <DebounceSelect
      mode='multiple'
      value={value}
      placeholder={placeholder}
      fetchOptions={fetchOptions}
      onChange={(newValue) => {
        onChange?.(newValue);
      }}
      style={{ width: "100%" }}
    />
  );
}

export default SelectFetching;
