import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppContextProvider } from './context/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const serverURI = 'http://18.223.205.127/api/';
// const serverURI = '/api/';
// const serverURI = 'http://localhost:4000/api/';
export default serverURI;

root.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>
);
