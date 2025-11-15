import { useState, useEffect } from 'react';

/**
 * Hook tùy chỉnh để trì hoãn (debounce) một giá trị.
 * @param {any} value - Giá trị cần trì hoãn (ví dụ: mảng blocks, chuỗi title)
 * @param {number} delay - Thời gian trì hoãn (ms), ví dụ: 1000
 * @returns {any} Giá trị đã trì hoãn
 */
function useDebounce(value, delay) {
  // 1. State để lưu trữ giá trị đã trì hoãn
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 2. Thiết lập một timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. Hủy timer nếu 'value' hoặc 'delay' thay đổi
    // (Điều này ngăn việc cập nhật nếu người dùng vẫn đang gõ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại nếu value hoặc delay thay đổi

  // 4. Trả về giá trị đã trì hoãn
  return debouncedValue;
}

export default useDebounce;