
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import './i18n/config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  </StrictMode>,
);
