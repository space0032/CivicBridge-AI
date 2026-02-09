import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlayerProvider } from 'react-intlayer';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IntlayerProvider>
      <App />
    </IntlayerProvider>
  </React.StrictMode>
);
