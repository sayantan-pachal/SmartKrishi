import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './component/Home/Home.jsx'
import Login from './component/Auth/Login.jsx'
import Signup from './component/Auth/Signup.jsx'
import ForgotPassword from './component/Auth/ForgotPassword.jsx'
import Dashboard from './component/Dashboard/Dashboard.jsx'
import ResetPassword from './component/Auth/ResetPassword.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Profile from './component/Profile/Profile.jsx'
import Settings from './component/Settings/Settings.jsx'
import Fields from './component/Fields/Fields.jsx'
import Crops from './component/Crops/Crops.jsx'
import Edgecase from './component/Other/Edgecase.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      {/* Protected Routes */}
      <Route path='dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='fields' element={<ProtectedRoute><Fields /></ProtectedRoute>} />
      <Route path='crops' element={<ProtectedRoute><Crops /></ProtectedRoute>} />
      <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      {/* 404  */}
      <Route path='*' element={<Edgecase />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)