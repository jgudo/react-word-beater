/* eslint-disable */
export default function register () { // Register the service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      navigator.serviceWorker
        .register(swUrl)
        .then(() => {
          console.log('Service worker installed');
        }).catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

export function unregister () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
