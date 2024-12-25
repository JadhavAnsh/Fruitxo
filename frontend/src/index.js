import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Fruits from './pages/Fruits';
import Service from './pages/Service';
import Contact from './pages/Contact';
import BaseLayout from './BaseLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signin from './pages/Signin';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';
axios.defaults.baseURL = 'http://localhost:5000';


const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <BaseLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/forgot-password',
          element: <ForgotPassword/>,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/fruits',
          element: <Fruits />,
        },
        {
          path: '/services',
          element: <Service />,
        },
        {
          path: '/contact',
          element: <Contact />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/signup',
          element: <Signin />,
        },
      ],
    },
  ]
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
