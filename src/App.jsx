import React from 'react'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { AuthContext } from './Context';
import { useToken } from './hooks/useToken';

import {ErrorPage, Main, Notice, Login, Manual} from './pages/index';
import AppContainer from './components/AppContainer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContainer/>,
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


const App = () => {
	const { token, addToken, removeToken } = useToken();

	return (
		<AuthContext.Provider value={{ token, addToken, removeToken }}>
			<RouterProvider router={router} />
		</AuthContext.Provider>
	)
}

export default App
