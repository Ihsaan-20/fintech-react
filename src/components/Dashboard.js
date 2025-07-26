import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaPlusCircle, FaPaperPlane, FaHistory } from 'react-icons/fa';

const Dashboard = () => {
  const { user, signout } = useContext(AuthContext);

  const [balance, setBalance] = useState('0.00');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
  try {
    const res = await fetch('/api/user/balance', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (!res.ok) throw new Error('Network response not ok');

    const balance = await res.json(); // ya agar plain number, use text + parseFloat
    console.log('Balance:', balance);
    setBalance(parseFloat(balance).toFixed(2));
  } catch (err) {
    console.error('Error fetching balance:', err);
    setError('Failed to fetch balance');
  }
};

  // Handlers for box clicks (just console for now)
  const handleAddMoney = () => alert('Redirect to Add Money page/form');
  const handleSendMoney = () => alert('Redirect to Send Money page/form');
  const handleTransactions = () => alert('Redirect to Transactions page');

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-purple-700">
          Welcome, <span className="text-primary">{user?.name || 'User'}</span>
        </h2>
        <button onClick={signout} className="btn btn-danger">
          Sign Out
        </button>
      </div>

      <div className="card card-custom p-4 mb-5 text-center">
        <h4>Your Current Balance</h4>
        <div className="balance-amount">${balance}</div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div
            className="liquid-box"
            role="button"
            tabIndex={0}
            onClick={handleAddMoney}
            onKeyDown={e => e.key === 'Enter' && handleAddMoney()}
          >
            <div className="liquid-icon text-success">
              <FaPlusCircle />
            </div>
            <h5>Add Money</h5>
            <p>Top up your wallet instantly</p>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="liquid-box"
            role="button"
            tabIndex={0}
            onClick={handleSendMoney}
            onKeyDown={e => e.key === 'Enter' && handleSendMoney()}
          >
            <div className="liquid-icon text-danger">
              <FaPaperPlane />
            </div>
            <h5>Send Money</h5>
            <p>Quickly transfer funds to others</p>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="liquid-box"
            role="button"
            tabIndex={0}
            onClick={handleTransactions}
            onKeyDown={e => e.key === 'Enter' && handleTransactions()}
          >
            <div className="liquid-icon text-info">
              <FaHistory />
            </div>
            <h5>Transactions</h5>
            <p>View your transaction history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
