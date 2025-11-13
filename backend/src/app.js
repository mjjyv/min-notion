import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares cơ bản
app.use(cors()); // Cho phép frontend gọi API
app.use(express.json()); // Phân tích body JSON

// Health Check Route (Để Giai đoạn 0 test)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running!' });
});

export default app;