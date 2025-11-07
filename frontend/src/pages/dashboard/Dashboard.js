import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import api from '../../api/api';
import Confetti from 'react-confetti';
import { toast } from 'react-toastify';
import './Dashboard.css';

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
      toast.success('Payment verified ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify payment');
    }
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);

    try {
      await api.post('/payments/submit');

      setPayments(prev => prev.map(p =>
        p.status === 'Verified' ? { ...p, status: 'Submitted' } : p
      ));

      toast.success('✅ All verified payments submitted to SWIFT');

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

    } catch {
      toast.error('Failed to submit payments');
    } finally {
      setSubmitting(false);
    }
  };

  const tableColumns = userRole === 'admin'
    ? ["Date", "Amount", "Currency", "Recipient", "Status", "Actions"]
    : ["Date", "Amount", "Currency", "Recipient", "Status"];

  const tableData = payments.map(payment => ({
    date: new Date(payment.date).toLocaleDateString(),
    amount: payment.amount,
    currency: payment.currency,
    recipient: payment.provider,
    status: payment.status,
    actions:
      payment.status === 'Pending' && userRole === 'admin'
        ? <Button variant="primary" size="small" onClick={() => handleVerify(payment._id)}>Verify</Button>
        : null
  }));

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {submitting && (
        <div className="swift-banner">
          🔄 Submitting Verified Payments to SWIFT Secure Network...
        </div>
      )}

      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h2>{userRole === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}</h2>

          {userRole === 'admin' && (
            <Button
              variant="primary"
              onClick={handleSubmitAll}
              loading={submitting}
              style={{ marginBottom: '15px' }}
            >
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
}

export default Dashboard;
