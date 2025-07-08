import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import './Signup.scss';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...userData } = formData;
      const response = await registerUser(userData);
      
      // Assuming your backend returns token and user data
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard/home');
        }
      } else {
        throw new Error('Registration successful but no token received');
      }

    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background"></div>
      
      <div className="signup-content">
        {/* Left Side - Branding */}
        <div className="brand-section">
          <div className="brand-logo">
            <span className="logo-icon">QE</span>
          </div>
          <h1 className="brand-title">QueueEase</h1>
          <p className="brand-tagline">
            Join thousands managing their immigration process efficiently
          </p>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time application tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure document upload</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Mobile-friendly interface</span>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Get started with your immigration journey</p>
            </div>

            {apiError && <div className="api-error-message">{apiError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="role">Register as</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className={errors.role ? 'error' : ''}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="input-group">
  <label htmlFor="confirmPassword">Confirm Password</label>
  <input
    id="confirmPassword"
    type={showPassword ? 'text' : 'password'}
    name="confirmPassword"
    placeholder="Confirm your password"
    value={formData.confirmPassword}
    onChange={handleChange}
    className={errors.confirmPassword ? 'error' : ''}
  />
  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
</div>
              <div className="form-options">
                <div className="terms-agreement">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className={`signup-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="login-link">
              Already have an account?{' '}
              <Link to="/login" className="login-text">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;