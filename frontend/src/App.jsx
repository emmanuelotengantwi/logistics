import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PublicTracking from './pages/PublicTracking';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/layout/Layout';
import DashboardNotFound from './pages/DashboardNotFound';
import Notifications from './pages/Notifications';
import ResetPassword from './pages/ResetPassword';

import CustomerAddress from './pages/customer/CustomerAddress';
import CustomerShipments from './pages/customer/CustomerShipments';
import CustomerPackingList from './pages/customer/CustomerPackingList';
import CustomerTrackShipment from './pages/customer/CustomerTrackShipment';
import CustomerPayments from './pages/customer/CustomerPayments';
import CustomerInvoices from './pages/customer/CustomerInvoices';
import CustomerWallet from './pages/customer/CustomerWallet';
import CustomerCbmCalculator from './pages/customer/CustomerCbmCalculator';
import CustomerComplaints from './pages/customer/CustomerComplaints';
import CustomerPickups from './pages/customer/CustomerPickups';
import CustomerTopUps from './pages/customer/CustomerTopUps';
import CustomerInvoicesReport from './pages/customer/CustomerInvoicesReport';

import ManageUsers from './pages/admin/ManageUsers';
import ConfigureRates from './pages/admin/ConfigureRates';

function App() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isAdmin = userInfo?.role === 'Admin';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/track" element={<PublicTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Layout />}>
          {isAdmin ? <Route index element={<AdminDashboard />} /> : <Route index element={<CustomerDashboard />} />}

          <Route path="notifications" element={<Notifications />} />

          {/* Customer */}
          {!isAdmin && (
            <>
              <Route path="address" element={<CustomerAddress />} />
              <Route path="shipments" element={<CustomerShipments />} />
              <Route path="packing-list" element={<CustomerPackingList />} />
              <Route path="track" element={<CustomerTrackShipment />} />
              <Route path="payments" element={<CustomerPayments />} />
              <Route path="invoices" element={<CustomerInvoices />} />
              <Route path="wallet" element={<CustomerWallet />} />
              <Route path="cbm" element={<CustomerCbmCalculator />} />
              <Route path="complaints" element={<CustomerComplaints />} />
              <Route path="pickups" element={<CustomerPickups />} />
              <Route path="topups" element={<CustomerTopUps />} />
              <Route path="invoices-report" element={<CustomerInvoicesReport />} />
            </>
          )}

          {/* Admin */}
          {isAdmin && (
            <>
              <Route path="users" element={<ManageUsers />} />
              <Route path="settings" element={<ConfigureRates />} />
            </>
          )}

          <Route path="*" element={<DashboardNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
