import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../api/api';
import { validateIDNumber, validateUsername, validateAccountNumber, validatePassword } from '../../utils/validators';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    username: '',
    accountNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    
    // Check for complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const complexityScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (complexityScore >= 3 && password.length >= 12) return 'strong';
    if (complexityScore >= 2 && password.length >= 8) return 'medium';
    return 'weak';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Check password strength
    if (field === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    let temp = {};
    
    if (formData.fullName.length < 3) {
      temp.fullName = 'Full name must be at least 3 characters';
    }
    if (!validateIDNumber(formData.idNumber)) {
      temp.idNumber = 'ID number must be exactly 13 digits';
    }
    if (!validateUsername(formData.username)) {
      temp.username = 'Username must be at least 3 characters (letters/numbers only)';
    }
    if (!validateAccountNumber(formData.accountNumber)) {
      temp.accountNumber = 'Account number must be exactly 10 digits';
    }
    if (!validatePassword(formData.password)) {
      temp.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('🎉 Registration successful! Welcome to IntBank.');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(`Registration failed: ${errorMessage}`);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak password';
      case 'medium': return 'Medium strength';
      case 'strong': return 'Strong password';
      default: return '';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Illustration Side */}
        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="bank-logo">IntBank</div>
            <h1>Join Our Global Banking Community</h1>
            <p>Experience world-class international banking with premium security features</p>
            
            <div className="security-features">
              <div className="security-item">
                <span className="security-icon">🌐</span>
                <span>Global Banking Network Access</span>
              </div>
              <div className="security-item">
                <span className="security-icon">💸</span>
                <span>Competitive Exchange Rates</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🔄</span>
                <span>Instant International Transfers</span>
              </div>
              <div className="security-item">
                <span className="security-icon">👨‍💼</span>
                <span>Dedicated Relationship Manager</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="auth-form">
          <form onSubmit={handleRegister}>
            <div className="form-header">
              <h2>Create Your Account</h2>
              <p>Join thousands of customers enjoying premium international banking services</p>
            </div>
            
            <div className="auth-form-content">
              <Input
                label="Full Legal Name"
                type="text"
                placeholder="Enter your full name as per ID"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={errors.fullName}
                required={true}
                icon="👤"
              />

              <Input
                label="Government ID Number"
                type="text"
                placeholder="Enter your 13-digit ID number"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                error={errors.idNumber}
                required={true}
                icon="🆔"
              />

              <Input
                label="Choose Username"
                type="text"
                placeholder="Create your username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                error={errors.username}
                required={true}
                icon="👤"
              />

              <Input
                label="Account Number"
                type="text"
                placeholder="Enter your 10-digit account number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                error={errors.accountNumber}
                required={true}
                icon="💳"
              />

              <Input
                label="Create Password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                required={true}
                icon="🔑"
              />

              {formData.password && (
                <>
                  <div className="password-strength">
                    <div className={`strength-bar strength-${passwordStrength}`}></div>
                  </div>
                  <div className="strength-label">{getPasswordStrengthText()}</div>
                </>
              )}

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required={true}
                icon="🔒"
              />

              <Button 
                type="submit" 
                variant="primary" 
                size="large"
                loading={isLoading}
                style={{ width: '100%', marginTop: '15px' }}
              >
                {isLoading ? 'Creating Account...' : 'Create International Account'}
              </Button>

              {errors.submit && (
                <div className="error-text" style={{ textAlign: 'center', marginTop: '10px' }}>
                  ⚠️ {errors.submit}
                </div>
              )}

              <div className="form-footer">
                <p className="auth-link">
                  Already have an account?
                  <Link to="/login">Sign In</Link>
                </p>
                
                <p className="terms-text">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;