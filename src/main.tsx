// Prevent TypeError: Cannot set property fetch of #<Window> which has only a getter
try {
  if (typeof window !== "undefined" && window.fetch) {
    let currentFetch = window.fetch;
    const patch = {
      get() {
        return currentFetch;
      },
      set(val: any) {
        currentFetch = val;
      },
      configurable: true,
      enumerable: true
    };
    try {
      Object.defineProperty(window, 'fetch', patch);
    } catch (e1) {
      try {
        const proto = Object.getPrototypeOf(window);
        if (proto) {
          Object.defineProperty(proto, 'fetch', patch);
        }
      } catch (e2) {
        try {
          if (typeof Window !== 'undefined' && Window.prototype) {
            Object.defineProperty(Window.prototype, 'fetch', patch);
          }
        } catch (e3) {
          console.warn('[NexHire] fetch prototype patch failed:', e3);
        }
      }
    }
  }
} catch (e) {
  console.warn('[NexHire] fetch patch skipped:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
