import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PublicTracking from './pages/PublicTracking';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/layout/Layout';

function App() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/track" element={<PublicTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Layout />}>
          {userInfo?.role === 'Admin' ? (
             <Route index element={<AdminDashboard />} />
          ) : (
             <Route index element={<CustomerDashboard />} />
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
