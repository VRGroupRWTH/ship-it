import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App'
import './index.css'
import RosbridgeConnections from './RosbridgeConnections';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <RosbridgeConnections>
          <App />
        </RosbridgeConnections>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
