import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerifyReceiver from './VerifyReceiver';
import CompleteTransaction from './CompleteTransaction';
import { FaCheckCircle, FaUserCheck, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';

const SendMoney = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [receiverData, setReceiverData] = useState(null);

  // Called when VerifyReceiver succeeds
  const handleVerified = ({ receiverName, receiverInput, transferType, bankName }) => {
    setReceiverData({
      receiverName,
      receiverInput,
      transferType,
      bankName,
    });
    setStep(2);
  };

  // Navigate to dashboard from VerifyReceiver
  const handleBackFromVerify = () => {
    console.log('Back clicked from VerifyReceiver');
    navigate('/dashboard');
  };

  // Navigate to dashboard from CompleteTransaction
  const handleBackFromComplete = () => {
    console.log('Back clicked from CompleteTransaction');
    navigate('/dashboard');
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Verify Receiver';
      case 2:
        return 'Complete Transaction';
      default:
        return 'Send Money';
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return <FaUserCheck />;
      case 2:
        return <FaPaperPlane />;
      default:
        return <FaPaperPlane />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 0',
      }}
    >
      <div className="container">
        {/* Header with Step Indicator */}


        {/* Step Content */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                minHeight: '400px',
              }}
            >
              <div className="card-body p-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                {/* Step Animation Container */}
                <div
                  style={{
                    transform: step === 1 ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: step === 1 ? '100%' : '0',
                    overflow: 'hidden',
                  }}
                >
                  {step === 1 && (
                    <div style={{ padding: '2rem' }}>
                      <VerifyReceiver
                        onVerified={handleVerified}
                        onBack={handleBackFromVerify}
                      />
                    </div>
                  )}
                </div>

                <div
                  style={{
                    transform: step === 2 ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: step === 2 ? '100%' : '0',
                    overflow: 'hidden',
                    position: step === 2 ? 'static' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {step === 2 && receiverData && (
                    <div style={{ padding: '2rem' }}>
                      <CompleteTransaction
                        receiverName={receiverData.receiverName}
                        receiverInput={receiverData.receiverInput}
                        transferType={receiverData.transferType}
                        bankName={receiverData.bankName}
                        onBack={handleBackFromComplete}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8">
            <div
              className="card border-0"
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
        </div>
      </div>
    </div>
  );
};

export default SendMoney;