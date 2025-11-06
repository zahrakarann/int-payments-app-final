import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../api/api';
import { validateUsername, validatePassword } from '../../utils/validators';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '', accountNumber: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value.trim() }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    let temp = {};
    if (!validateUsername(formData.username)) temp.username = 'Username must be at least 3 characters';
    if (!validatePassword(formData.password)) temp.password = 'Password must be at least 6 characters';
    if (!/^\d{10}$/.test(formData.accountNumber)) temp.accountNumber = 'Account number must be 10 digits';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error('Please fix the errors before submitting');

    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      toast.success('Login successful');

      // save user info in memory (optional) instead of localStorage
      window.currentUser = res.data.user;

      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      toast.error(`Login failed: ${errorMessage}`);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="bank-logo">IntBank</div>
            <h1>Employee Portal</h1>
            <p>Secure access to transaction verification and SWIFT submission</p>
          </div>
        </div>

        <div className="auth-form">
          <form onSubmit={handleLogin}>
            <h2>Sign In</h2>
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              error={errors.username}
              icon="👤"
            />
            <Input
              label="Account Number"
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              error={errors.accountNumber}
              icon="💳"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              icon="🔑"
            />
            <Button type="submit" variant="primary" size="large" loading={isLoading} style={{ width: '100%', marginTop: '15px' }}>
              Sign In
            </Button>
            {errors.submit && <p className="error">{errors.submit}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
