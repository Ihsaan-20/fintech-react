import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaApple, FaGithub } from 'react-icons/fa';

const Login = () => {
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) navigate('/dashboard');
  };

  const handleSocialLogin = (provider) => {
    alert(`Login with ${provider} clicked!`);
    // TODO: Implement OAuth flow here
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden',
        padding: '1rem',
      }}
    >
      <div
        className="card border-0 shadow-lg p-4"
        style={{
          maxWidth: '400px',
          width: '100%',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <h3 className="text-center mb-3 fw-bold" style={{ color: '#2d3748' }}>
          Welcome Back 👋
        </h3>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label fw-semibold">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              type="tel"
              className="form-control"
              placeholder="Enter your mobile number (e.g. 03157073692)"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold mb-3"
            style={{
              borderRadius: '50px',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #3b8dd6 0%, #00c4d6 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Log In
          </button>
        </form>

        <div className="text-center mb-3">
          <small>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none fw-semibold">
              Sign up
            </Link>
          </small>
        </div>

        <hr className="mb-3" />

        {/* <div className="text-center">
          <p className="mb-2 fw-semibold" style={{ color: '#2d3748' }}>Or sign in with</p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-secondary border-0 shadow-sm"
              onClick={() => handleSocialLogin('Google')}
              style={{
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <FaGoogle size={20} color="#DB4437" />
            </button>
            <button
              className="btn btn-outline-secondary border-0 shadow-sm"
              onClick={() => handleSocialLogin('Apple')}
              style={{
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <FaApple size={20} color="#000000" />
            </button>
            <button
              className="btn btn-outline-secondary border-0 shadow-sm"
              onClick={() => handleSocialLogin('GitHub')}
              style={{
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <FaGithub size={20} color="#333" />
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
