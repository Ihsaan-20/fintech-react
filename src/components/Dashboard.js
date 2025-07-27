import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaPlusCircle, FaPaperPlane, FaHistory, FaSignOutAlt, FaWallet } from 'react-icons/fa';

const Dashboard = () => {
  const { user, signout, updateUser } = useContext(AuthContext);
  console.log('Dashboard user:', user);
  const navigate = useNavigate();

  const [balance, setBalance] = useState(user?.balance || 0);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  let intervalId;

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8080/api/v1/user/balance', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch balance');

      setBalance(data.data.balance);

      if (updateUser) {
        updateUser({ ...user, balance: data.data.balance });
      }
    } catch (err) {
      console.error('Error fetching balance:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // First time fetch
  fetchBalance();

  // Set interval to auto-refresh balance every 10 seconds
  intervalId = setInterval(fetchBalance, 1000); // 5000 ms = 5 sec

  // Clean up interval on component unmount
  return () => clearInterval(intervalId);
}, []);

  // const handleAddMoney = () => navigate('/add-money');
  const handleAddMoney = () => alert('Add Money feature coming soon!');
  const handleSendMoney = () => navigate('/send-money');
  const handleTransactions = () => navigate('/transactions');

  const displayName = user?.name || 'User';
  // const formattedBalance = parseFloat(balance).toFixed(2);
  const formattedBalance = parseFloat(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2, // last .00
    maximumFractionDigits: 2,
  });

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="container"
        style={{
          maxHeight: '100vh',
          // overflowY: 'auto',
          padding: '2.5rem 0',
        }}
      >
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1
              className="text-white mb-1"
              style={{ fontWeight: '300', fontSize: '2rem' }}
            >
              Welcome back,
            </h1>
            <h2
              className="text-white"
              style={{ fontWeight: '600', fontSize: '1.5rem' }}
            >
              {displayName} 👋
            </h2>
          </div>
          <button
            onClick={signout}
            className="btn"
            style={{
              borderRadius: '50px',
              padding: '0.5rem 1.5rem',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #3b8dd6 0%, #00c4d6 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
              e.target.style.transform = 'translateY(0)';
            }}
            aria-label="Sign out"
          >
            <FaSignOutAlt className="me-2" />
            Sign Out
          </button>
        </div>

        {/* Balance Card */}
        <div
          className="card border-0 shadow-lg mb-3"
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '1.5rem',
            maxHeight: 'calc(100vh - 120px)',
            overflow: 'hidden',
          }}
        >
          <div className="text-center">
            <div className="mb-2">
              <FaWallet style={{ fontSize: '2.5rem', color: '#667eea', opacity: '0.8' }} />
            </div>
            <h4 className="text-muted mb-2" style={{ fontWeight: '400' }}>
              Current Balance
            </h4>
            <div
              className="balance-amount text-dark mb-0"
              style={{
                fontSize: '3rem',
                fontWeight: '700',
                fontFamily: 'monospace',
                color: '#2d3748',
              }}
            >
              {isLoading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                `$${formattedBalance}`
              )}
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="row g-3" >
          <div className="col-lg-4 col-md-6">
            <div
              className="card border-0 shadow-lg"
              role="button"
              tabIndex={0}
              onClick={handleAddMoney}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMoney()}
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                maxHeight: '200px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(79, 172, 254, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-3">
                <div className="mb-3">
                  <FaPlusCircle style={{ fontSize: '3rem', opacity: '0.9' }} />
                </div>
                <h4 className="card-title mb-2" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                  Add Money
                </h4>
                <p className="card-text" style={{ opacity: '0.9', fontSize: '0.9rem' }}>
                  Top up your wallet instantly and securely
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div
              className="card border-0 shadow-lg"
              role="button"
              tabIndex={0}
              onClick={handleSendMoney}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMoney()}
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                maxHeight: '200px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(250, 112, 154, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-3">
                <div className="mb-3">
                  <FaPaperPlane style={{ fontSize: '3rem', opacity: '0.9' }} />
                </div>
                <h4 className="card-title mb-2" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                  Send Money
                </h4>
                <p className="card-text" style={{ opacity: '0.9', fontSize: '0.9rem' }}>
                  Transfer funds quickly to friends & family
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mx-auto">
            <div
              className="card border-0 shadow-lg"
              role="button"
              tabIndex={0}
              onClick={handleTransactions}
              onKeyDown={(e) => e.key === 'Enter' && handleTransactions()}
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                color: '#2d3748',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                maxHeight: '200px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(168, 237, 234, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-3">
                <div className="mb-3">
                  <FaHistory style={{ fontSize: '3rem', opacity: '0.8' }} />
                </div>
                <h4 className="card-title mb-2" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                  Transaction History
                </h4>
                <p className="card-text" style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                  View all your recent transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;