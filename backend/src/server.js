import app from './app.js';
import dotenv from 'dotenv';

// Nạp biến môi trường
dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend server đang chạy trên http://localhost:${PORT}`);
});