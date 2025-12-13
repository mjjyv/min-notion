import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // File CSS/Tailwind
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext'; // <-- Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider> {/* <-- Bọc ThemeProvider */}
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);