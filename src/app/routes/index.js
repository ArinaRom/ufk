import { createBrowserRouter } from "react-router-dom";
import { ErrorPage, LoginPage, MainPage, ManualPage, CreateNoticePage, DispatcherPage } from "../../pages";
import AppContainer from "../../components/AppContainer";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContainer/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '',
        element: <MainPage/>,
      },
      {
        path: 'notice',
        element: <CreateNoticePage/>,
      },
      {
        path: 'notice/list',
        element: <DispatcherPage/>,
      },
      {
        path: 'notice/:id',
        element: <CreateNoticePage/>,
      },
      {
        path: 'login',
        element: <LoginPage/>
      },
      {
        path: 'manual',
        element: <ManualPage/>
      }
    ]
  },
]);