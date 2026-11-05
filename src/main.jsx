import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SportsProvider } from './context/SportsContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SportsProvider>
          <App />
        </SportsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
