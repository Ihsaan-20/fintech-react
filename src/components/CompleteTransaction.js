import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const CompleteTransaction = ({ receiverName, receiverInput, transferType, bankName }) => {
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    setError('');
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount before requesting OTP.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8080/api/v1/transaction/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverInput,
          amount,
          transferType,
          bankName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.message && data.message.toLowerCase().includes('insufficient')) {
          setError('Insufficient balance. Please add money to your account.');
        } else {
          throw new Error(data.message || 'Failed to send OTP');
        }
        return;
      }

      setOtpSent(true);
      alert(`OTP sent: ${data.data.otp} (Dev Only)`); // Test only
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8080/api/v1/transaction/complete-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverInput,
          amount,
          otp,
          transferType,
          bankName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.message && data.message.toLowerCase().includes('insufficient')) {
          setError('Insufficient balance. Please add money to your account.');
        } else if (data.message && data.message.toLowerCase().includes('expired')) {
          setError('OTP has expired. Please request a new OTP.');
          setOtpSent(false);
          setOtp('');
        } else if (data.message && data.message.toLowerCase().includes('invalid')) {
          setError('Invalid OTP. Please check and try again.');
        } else {
          throw new Error(data.message || 'Transaction failed');
        }
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
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
            {!showSuccess ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="mb-2 d-flex align-items-center justify-content-center">
                    <span className="me-3" style={{ fontSize: '1.5rem', color: '#667eea' }}>
                      <FaCheckCircle />
                    </span>
                    Complete Transaction
                  </h3>
                  <p className="text-muted mb-0">
                    Enter amount and complete your transfer
                  </p>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Receiver</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receiverName}
                    disabled
                    style={{
                      borderRadius: '10px',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Bank</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bankName}
                    disabled
                    style={{
                      borderRadius: '10px',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      borderRadius: '10px',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </div>

                {!otpSent && (
                  <button
                    onClick={handleRequestOtp}
                    className="btn"
                    style={{
                      borderRadius: '10px',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                      width: '100%',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Send Money
                  </button>
                )}

                {otpSent && (
                  <>
                    <div className="mb-4">
                      <label className="form-label fw-bold">OTP</label>
                      <input
                        type="text"
                        className="form-control"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="btn"
                      style={{
                        borderRadius: '10px',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        color: 'white',
                        width: '100%',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Complete Transaction
                    </button>
                  </>
                )}

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
              </>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'block',
                    strokeWidth: '2',
                    stroke: '#4CAF50',
                    strokeMiterlimit: '10',
                    margin: '10px auto',
                    boxShadow: 'inset 0px 0px 0px #4CAF50',
                    animation: 'fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      zIndex: '1',
                      transform: 'scale(0)',
                      animation: 'scale .3s ease-in-out .9s both',
                    }}
                  >
                    <span
                      style={{
                        height: '2px',
                        backgroundColor: '#4CAF50',
                        display: 'block',
                        borderRadius: '2px',
                        position: 'absolute',
                        zIndex: '1',
                        top: '27px',
                        left: '16px',
                        width: '10px',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left center',
                        animation: 'stroke .15s ease-in-out 1.2s forwards',
                      }}
                    ></span>
                    <span
                      style={{
                        height: '2px',
                        backgroundColor: '#4CAF50',
                        display: 'block',
                        borderRadius: '2px',
                        position: 'absolute',
                        zIndex: '1',
                        top: '24px',
                        right: '10px',
                        width: '25px',
                        transform: 'scaleX(0)',
                        transformOrigin: 'right center',
                        animation: 'stroke .15s ease-in-out 1.05s forwards',
                      }}
                    ></span>
                    <div
                      style={{
                        top: '-1px',
                        left: '-1px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        border: '2px solid #4CAF50',
                        transform: 'scale(0)',
                        animation: 'scale .3s ease-in-out .9s both',
                      }}
                    ></div>
                    <div
                      style={{
                        top: '10px',
                        width: '5px',
                        left: '28px',
                        zIndex: '1',
                        height: '85px',
                        position: 'absolute',
                        transform: 'rotate(-45deg)',
                      }}
                    ></div>
                  </div>
                </div>
                <h2
                  style={{
                    color: '#4CAF50',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: '25px 0 15px 0',
                    animation: 'fadeInUp 0.6s ease-out 1.4s both',
                  }}
                >
                  Transaction Successful!
                </h2>
                <p
                  style={{
                    color: '#666',
                    fontSize: '16px',
                    marginBottom: '30px',
                    animation: 'fadeInUp 0.6s ease-out 1.6s both',
                  }}
                >
                  ₹{amount} sent to {receiverName} via {bankName} successfully
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    margin: '20px 0',
                    animation: 'fadeInUp 0.6s ease-out 1.8s both',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50',
                      margin: '0 2px',
                      animation: 'loading 1.4s infinite ease-in-out both',
                      animationDelay: '-0.32s',
                    }}
                  ></span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50',
                      margin: '0 2px',
                      animation: 'loading 1.4s infinite ease-in-out both',
                      animationDelay: '-0.16s',
                    }}
                  ></span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50',
                      margin: '0 2px',
                      animation: 'loading 1.4s infinite ease-in-out both',
                    }}
                  ></span>
                </div>
                <p
                  style={{
                    color: '#888',
                    fontSize: '14px',
                    animation: 'fadeInUp 0.6s ease-out 2s both',
                  }}
                >
                  Redirecting to dashboard...
                </p>
              </div>
            )}
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
              🔒 Your transaction is secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stroke {
          100% {
            transform: scaleX(1);
          }
        }

        @keyframes scale {
          0%, 20% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #4CAF50;
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CompleteTransaction;