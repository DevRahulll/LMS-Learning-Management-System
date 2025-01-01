import './index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import {Provider} from "react-redux"

import App from './App.jsx';
import store from './Redux/store.js';

createRoot(document.getElementById('root')).render(
  <Provider>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
)
