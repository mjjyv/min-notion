// client/src/hooks/useAuth.js
import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // giả sử bạn chỉ cần biết có token là đủ
    } else {
      setUser(null);
    }
  }, []);

  return { user };
}
