import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import Maintenance from './Maintenance.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Maintenance />
  </React.StrictMode>,
);
