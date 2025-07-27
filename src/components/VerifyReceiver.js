import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const VerifyReceiver = ({ onVerified, onBack }) => {
  const [transferType, setTransferType] = useState('fintech');
  const [receiverInput, setReceiverInput] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState('');

  const banks = ['Nayapay', 'Easypaisa', 'HBL', 'Meezan', 'UBL','Jazzcash'];

  const validateReceiverInput = () => {
    if (!receiverInput) return 'Receiver input is required';

    if (transferType === 'fintech') {
      if (!/^\d{11}$/.test(receiverInput)) return 'Fintech number must be exactly 11 digits';
    } else if (transferType === 'bank') {
      if (!bankName) return 'Please select a bank';
      if (bankName === 'Nayapay' || bankName === 'Easypaisa') {
        if (!/^\d{11}$/.test(receiverInput)) return `${bankName} number must be 11 digits`;
      } else {
        if (!/^PK[0-9A-Z]{22}$/.test(receiverInput))
          return 'IBAN must start with PK and be 24 characters long';
      }
    }
    return null;
  };

  const getFinalBankName = () => {
    if (transferType === 'fintech') {
      return 'Fintech';
    } else if (transferType === 'bank') {
      return bankName;
    }
    return '';
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateReceiverInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8080/api/v1/transaction/verify-receiver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: transferType.toUpperCase(),
          bankName: transferType === 'bank' ? bankName : null,
          mobileNumber: transferType === 'fintech' ? receiverInput : null,
          account: transferType === 'bank' ? receiverInput : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      onVerified({
        receiverName: data.data.accountHolderName || data.data.firstName + ' ' + data.data.lastName,
        receiverInput,
        transferType,
        bankName: transferType === 'fintech' ? 'Fintech' : bankName,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 0',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '500px' }}>
        <div
          className="card border-0 shadow-lg"
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h3 className="mb-2 d-flex align-items-center justify-content-center">
                <span className="me-3" style={{ fontSize: '1.5rem', color: '#667eea' }}>
                  <FaCheckCircle />
                </span>
                Verify Receiver
              </h3>
              <p className="text-muted mb-0">
                Enter receiver details to verify account
              </p>
            </div>

            <form onSubmit={handleVerify}>
              <div className="mb-4">
                <label className="form-label fw-bold">Transfer Type</label>
                <select
                  value={transferType}
                  onChange={(e) => {
                    setTransferType(e.target.value);
                    setReceiverInput('');
                    setBankName('');
                    setError('');
                  }}
                  className="form-select"
                  style={{
                    borderRadius: '10px',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <option value="fintech">Fintech</option>
                  <option value="bank">Bank</option>
                </select>
              </div>

              {transferType === 'bank' && (
                <div className="mb-4">
                  <label className="form-label fw-bold">Select Bank</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="form-select"
                    style={{
                      borderRadius: '10px',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <option value="">-- Select Bank --</option>
                    {banks.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-bold">Number / IBAN / Account</label>
                <input
                  type="text"
                  value={receiverInput}
                  onChange={(e) => setReceiverInput(e.target.value)}
                  className="form-control"
                  placeholder={
                    transferType === 'fintech'
                      ? '11-digit mobile number'
                      : bankName === 'Nayapay' || bankName === 'Easypaisa'
                      ? '11-digit mobile number'
                      : 'PK.. IBAN 24 chars'
                  }
                  style={{
                    borderRadius: '10px',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>

              {error && (
                <div
                  className="text-danger mb-4"
                  style={{
                    background: 'rgba(255, 0, 0, 0.1)',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </div>
              )}

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  onClick={onBack}
                  className="btn btn-outline-secondary"
                  style={{
                    borderRadius: '10px',
                    padding: '0.75rem 1.5rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    borderRadius: '10px',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          className="card border-0 mt-4"
          style={{
            borderRadius: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="card-body p-3 text-center">
            <p className="text-white mb-0" style={{ fontSize: '0.9rem', opacity: '0.8' }}>
              🔒 Your data is secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyReceiver;