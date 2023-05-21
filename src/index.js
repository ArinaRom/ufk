import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider, createBrowserRouter} from "react-router-dom";

import './styles/index.scss';
import App from './App';
import {ErrorPage, Main, Notice, Login, Manual} from './pages/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '',
        element: <Main/>,
      },
      {
        path: 'notice',
        element: <Notice/>,
      },
      {
        path: 'notice/list',
        element: <Notice/>,
      },
      {
        path: 'notice/:id',
        element: <Notice/>,
      },
      {
        path: 'login',
        element: <Login/>
      },
      {
        path: 'manual',
        element: <Manual/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
