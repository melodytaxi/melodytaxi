import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Drivers from "./views/Drivers.jsx";
import DriverForm from "./views/DriverForm.jsx";
import Home from "./views/Home.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/drivers"/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/drivers',
        element: <Drivers/>
      },
      {
        path: '/drivers/new',
        element: <DriverForm key="driverCreate" />
      },
      {
        path: '/drivers/:id',
        element: <DriverForm key="driverUpdate" />
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      },
      {
        path: '/home',
        element: <Home/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
