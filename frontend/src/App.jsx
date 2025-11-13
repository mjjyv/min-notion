// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

// Lấy URL từ biến môi trường Vite 
const API_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [message, setMessage] = useState('Đang tải...');

  useEffect(() => {
    // Gọi API Health Check 
    axios.get(`${API_URL}/health`)
      .then(response => {
        setMessage(`Kết nối Backend thành công: ${response.data.message}`);
      })
      .catch(error => {
        setMessage(`Lỗi kết nối Backend: ${error.message}`);
      });
  }, []);

  return (
    <div>
      <h1>Dự án Mini-Notion</h1>
      <p>Trạng thái: {message}</p>
    </div>
  );
}

export default App;