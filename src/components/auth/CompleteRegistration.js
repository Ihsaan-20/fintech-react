import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

export default function CompleteRegistration() {
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const mobileNumber = location.state?.mobileNumber;
  const country = location.state?.country;

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleComplete = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/verification/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
          country,
          firstName,
          middleName,
          lastName,
          password
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Registration failed");
      }

      const data = await response.json();
      console.log(data);

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      setUser(data.data.user);

      navigate("/dashboard");

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
          Complete Registration ✅
        </h2>

        <form onSubmit={handleComplete} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-control"
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Middle Name</label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="form-control"
              placeholder="(Optional)"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-control"
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <small className="text-danger">{error}</small>}

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{
              borderRadius: '50px',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              marginTop: '1rem'
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
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}
