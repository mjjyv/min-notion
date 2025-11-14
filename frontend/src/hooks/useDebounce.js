import { useState, useEffect } from 'react';

/**
 * Hook để trì hoãn (debounce) một giá trị.
 * Chỉ cập nhật giá trị trả về sau khi 'delay' (ms) trôi qua.
 * @param {any} value Giá trị cần trì hoãn
 * @param {number} delay Thời gian trì hoãn (ms)
 * @returns {any} Giá trị đã trì hoãn
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đặt timeout để cập nhật giá trị sau khi hết 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy timeout nếu 'value' hoặc 'delay' thay đổi
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};