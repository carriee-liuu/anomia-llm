import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import './index.css';
import App from './App';

// Handle GitHub Pages 404.html redirect
// The 404.html stores the path in sessionStorage and redirects to index.html
// We then restore the path here
const redirect = sessionStorage.redirect;
if (redirect) {
  delete sessionStorage.redirect;
  const path = redirect;
  // Only restore if it's different from current path
  if (path !== window.location.pathname) {
    window.history.replaceState(null, null, path);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 