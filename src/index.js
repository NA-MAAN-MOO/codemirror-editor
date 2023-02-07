import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { useMutation, QueryClient, QueryClientProvider } from 'react-query'; //1번
// import { redisClient } from './redisClient.js';

/* 2번 */
// const queryClient = new QueryClient({
//   cache: false,
//   client: redisClient,
// });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
    <App />
    {/* </QueryClientProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
