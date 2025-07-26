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

      // ✅ Verified — move to Complete Registration
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
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <h2 className="mb-4 text-center">Verify OTP</h2>
      <form onSubmit={handleVerify} className="border p-4 rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            className="form-control"
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3 text-muted">
          {timer > 0 ? `Expires in: ${timer} seconds` : "OTP expired"}
        </div>

        {error && <small className="text-danger">{error}</small>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={timer === 0}>
          Verify OTP
        </button>

        {resendVisible && (
          <button
            type="button"
            className="btn btn-link w-100 mt-3"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        )}

        {/* ✅ Back to Register */}
        <div className="text-center mt-3">
          <Link to="/register" className="btn btn-link">
            &larr; Back to Register
          </Link>
        </div>

      </form>
    </div>
  );
}
