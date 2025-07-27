import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const [resendVisible, setResendVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const mobileNumber = location.state?.mobileNumber;
  const country = location.state?.country;

  useEffect(() => {
    if (!mobileNumber) {
      navigate("/register");
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setResendVisible(true);
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [mobileNumber, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/verification/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          otp: otp
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Verification failed");
      }

      navigate("/complete-registration", {
        state: { mobileNumber, country }
      });

    } catch (err) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccessMessage("");
    setResendVisible(false);
    setTimer(60);

    try {
      const response = await fetch("http://localhost:8080/api/v1/verification/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          country: country
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to resend OTP");
      }

      const data = await response.json();
      setSuccessMessage(`OTP re-sent successfully! [Demo OTP: ${data.data.otp}]`);

    } catch (err) {
      setError(err.message);
    }
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
          maxWidth: "420px",
          width: "100%",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h2 className="mb-4 text-center fw-bold" style={{ color: '#2d3748' }}>
          Verify OTP 🔒
        </h2>

        <form onSubmit={handleVerify} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              className="form-control"
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control"
              placeholder="Enter OTP"
              required
            />
          </div>

          <div className="mb-3 text-muted">
            {timer > 0 ? `Expires in: ${timer} seconds` : "OTP expired"}
          </div>

          {error && <small className="text-danger">{error}</small>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <button
            type="submit"
            className="btn w-100 fw-semibold mb-3"
            disabled={timer === 0}
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
            Verify OTP
          </button>

          {resendVisible && (
            <button
              type="button"
              className="btn btn-link w-100 fw-semibold mb-2"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}

          <div className="text-center mt-2">
            <Link to="/register" className="text-primary text-decoration-none fw-semibold">
              ← Back to Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
