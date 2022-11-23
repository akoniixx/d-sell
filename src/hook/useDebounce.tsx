import { useState, useEffect } from "react";

const useDebounce = (value?: string | number | string[], delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setLoading(false);

      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, loading];
};

export default useDebounce;
