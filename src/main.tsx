import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // ⬅ changed from BrowserRouter to HashRouter
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
      <Toaster position="top-right" />
    </HashRouter>
  </StrictMode>
);