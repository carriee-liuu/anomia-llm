import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import './index.css';
import App from './App';

// Handle GitHub Pages 404.html redirect
// The 404.html redirects with path in query string like: /anomia-llm/?/waiting-room/ABC123
const path = window.location.pathname;
const search = window.location.search;
if (search.startsWith('?/')) {
  // Extract the path from query string (spa-github-pages format)
  const redirectPath = search.slice(2).replace(/~and~/g, '&').split('&')[0];
  if (redirectPath) {
    window.history.replaceState(null, '', '/anomia-llm' + redirectPath + window.location.hash);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 