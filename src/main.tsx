import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/parceleaseadmin192211363"> {/* 👈 Required for GitHub Pages */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
