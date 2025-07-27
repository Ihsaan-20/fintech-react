import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

const countries = [
  { code: "PK", name: "Pakistan" },
  { code: "PS", name: "Palestine" },
  { code: "IR", name: "Iran" },
  // Add more if needed
];

export default function Register() {
  const navigate = useNavigate();

  const [country, setCountry] = useState("PK");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobileRegex = /^[0-9]{11}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setError("Mobile number must be exactly 11 digits");
      return;
    }
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/verification/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          country: country
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();
      console.log(data);
      setSuccessMessage(`OTP Sent Successfully! [Demo OTP: ${data.data.otp}]`);

      navigate("/verify-otp", {
        state: {
          mobileNumber: mobileNumber,
          country: country,
        },
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
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
          Create Account 🚀
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="country" className="form-label fw-semibold">Country</label>
            <select
              id="country"
              className="form-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label fw-semibold">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              className="form-control"
              placeholder="Enter 11 digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              maxLength={11}
              required
            />
            {error && <small className="text-danger">{error}</small>}
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold mb-3"
            disabled={loading}
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
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {successMessage && (
            <div className="alert alert-success mt-2">{successMessage}</div>
          )}

          <div className="text-center mt-3">
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
