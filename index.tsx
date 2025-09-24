import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PlayerProvider } from './context/PlayerContext';
import { SettingsProvider } from './context/SettingsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </SettingsProvider>
  </React.StrictMode>
);