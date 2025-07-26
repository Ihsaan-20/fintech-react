import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaPlusCircle, FaPaperPlane, FaHistory } from 'react-icons/fa';

const Dashboard = () => {
  const { user, signout } = useContext(AuthContext);

  console.log('[Dashboard] user context:', user);

  const handleAddMoney = () => alert('Redirect to Add Money page/form');
  const handleSendMoney = () => alert('Redirect to Send Money page/form');
  const handleTransactions = () => alert('Redirect to Transactions page');

  const displayName = user?.name || 'User';
  const balance = user?.balance != null ? parseFloat(user.balance).toFixed(2) : '0.00';

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Welcome, <span className="text-primary">{displayName}</span>
        </h2>
        <button onClick={signout} className="btn btn-danger">
          Sign Out
        </button>
      </div>

      <div className="card p-4 mb-5 text-center">
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
            onKeyDown={(e) => e.key === 'Enter' && handleAddMoney()}
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
            onKeyDown={(e) => e.key === 'Enter' && handleSendMoney()}
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
            onKeyDown={(e) => e.key === 'Enter' && handleTransactions()}
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
