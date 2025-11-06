import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import api from '../../api/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tokenRes = await api.get('/auth/me');
        setUserRole(tokenRes.data.role);

        const res = await api.get('/payments');
        setPayments(res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.post(`/payments/${id}/verify`);
      setPayments(prev => prev.map(p => p._id === id ? { ...p, status: 'Verified' } : p));
      toast.success('Payment verified');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify payment');
    }
  };

  const handleSubmitAll = async () => {
    try {
      await api.post('/payments/submit');
      setPayments(prev => prev.map(p => p.status === 'Verified' ? { ...p, status: 'Submitted' } : p));
      toast.success('All verified payments submitted');
    } catch {
      toast.error('Failed to submit payments');
    }
  };

// Conditionally set columns based on role
const tableColumns = userRole === 'admin'
  ? ["Date", "Amount", "Currency", "Recipient", "Status", "Actions"]
  : ["Date", "Amount", "Currency", "Recipient", "Status"];


  const tableData = payments.map(payment => ({
    date: new Date(payment.date).toLocaleDateString(),
    amount: payment.amount,
    currency: payment.currency,
    recipient: payment.provider,
    status: payment.status,
    actions: payment.status === 'Pending' && userRole === 'admin'
      ? <Button variant="primary" size="small" onClick={() => handleVerify(payment._id)}>Verify</Button>
      : null
  }));

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h2>{userRole === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}</h2>
          {userRole === 'admin' && (
            <Button variant="primary" onClick={handleSubmitAll} style={{ marginBottom: '15px' }}>
              Submit Verified to SWIFT
            </Button>
          )}
          <Table
            columns={tableColumns}
            data={tableData}
            loading={loading}
            emptyMessage="No transactions found."
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
