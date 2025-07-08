import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      const redirectPath = user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/dashboard/home';
      navigate(redirectPath);

    } catch (err) {
      // Enhanced error handling
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Login failed. Please try again.';
      
      // Field-specific errors from backend
      if (err.response?.data?.field) {
        setErrors(prev => ({
          ...prev,
          [err.response.data.field]: errorMessage
        }));
      } else {
        setApiError(errorMessage);
      }
      
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-content">
        {/* Left Side - Branding */}
        <div className="brand-section">
          <div className="brand-logo">
            <span className="logo-icon">QE</span>
          </div>
          <h1 className="brand-title">QueueEase</h1>
          <p className="brand-tagline">
            Modern queue management for Ethiopia's immigration services
          </p>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time updates</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure authentication</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>24/7 access</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to manage your immigration applications</p>
            </div>

            {apiError && <div className="error-message">{apiError}</div>}

            <form onSubmit={handleSubmit}>
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
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <div className="password-label-container">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="social-login">
              <div className="divider">
                <span>OR</span>
              </div>
              <div className="social-buttons">
                <button type="button" className="social-button google">
                  <span className="social-icon">G</span>
                  Continue with Google
                </button>
                <button type="button" className="social-button facebook">
                  <span className="social-icon">f</span>
                  Continue with Facebook
                </button>
              </div>
            </div>

            <div className="signup-link">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-text">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;