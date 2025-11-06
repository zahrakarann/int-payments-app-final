import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
// import Register from '../pages/auth/Register';   // not used
import Dashboard from '../pages/dashboard/Dashboard';
// import Payments from '../pages/payments/Payments'; // not used

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/payments" element={<Payments />} /> */}
    </Routes>
  </Router>
);

export default AppRoutes;
