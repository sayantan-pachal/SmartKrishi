import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './component/Home/Home.jsx'
import Login from './component/Auth/Login.jsx'
import Signup from './component/Auth/Signup.jsx'
import ForgetPassword from './component/Auth/ForgetPassword.jsx'
import Dashboard from './component/Dashboard/Dashboard.jsx'
import ResetPassword from './component/Auth/ResetPassword.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Profile from './component/Profile/Profile.jsx'
import Settings from './component/Settings/Settings.jsx'
import Fields from './component/Fields/Fields.jsx'
import Crops from './component/Crops/Crops.jsx'
import Advisory from './component/Advisory/Advisory.jsx'
import Edgecase from './component/Other/Edgecase.jsx'
import { ToastProvider } from "./component/Other/ToastContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      {/* Standalone Route: Home loads WITHOUT the Layout (No Header/Footer) */}
      <Route path='' element={<Home />} />
      {/* Authentication Routes: Usually also standalone (No Header/Footer) */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      {/* Protected Routes: Wrapped INSIDE the Layout (Header + Outlet + Footer) */}
      <Route element={<Layout />}>
        <Route path='dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='fields' element={<ProtectedRoute><Fields /></ProtectedRoute>} />
        <Route path='crops' element={<ProtectedRoute><Crops /></ProtectedRoute>} />
        <Route path='advisory' element={<ProtectedRoute><Advisory /></ProtectedRoute>} />
        <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>
      {/* 404 */}
      <Route path='*' element={<Edgecase />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>,
)