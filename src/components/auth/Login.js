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
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="card-title text-center mb-4 fw-bold">Welcome Back</h3>

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
              placeholder="Enter your mobile number"
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

          <button type="submit" className="btn btn-primary w-100 fw-semibold mb-3">
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

        <hr />

        {/* <div className="text-center mb-2 fw-semibold text-secondary">Or login with</div> */}

        {/* <div className="d-flex justify-content-center gap-3">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            style={{ minWidth: '120px' }}
          >
            <FaGoogle size={20} /> Google
          </button>
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="btn btn-outline-dark d-flex align-items-center gap-2"
            style={{ minWidth: '120px' }}
          >
            <FaApple size={20} /> Apple
          </button>
          <button
            onClick={() => handleSocialLogin('GitHub')}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            style={{ minWidth: '120px' }}
          >
            <FaGithub size={20} /> GitHub
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
