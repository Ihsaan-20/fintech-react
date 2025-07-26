import React, { useState } from 'react';
import { useNavigate,Link } from "react-router-dom";


const countries = [
  { code: "PK", name: "Pakistan" },
  { code: "PS", name: "Palestine" },
  { code: "IR", name: "Iran" },
  // Add more if needed
];

export default function Register() {
  const navigate = useNavigate(); // ✅ INSIDE FUNCTION

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

      // ✅ Redirect after success:
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
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <h2 className="mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        <div className="mb-3">
          <label htmlFor="country" className="form-label">Country</label>
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
          <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            className="form-control"
            placeholder="Enter 11 digit mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={11}
          />
          {error && <small className="text-danger">{error}</small>}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}

        {/* ✅ Back to Login */}
        <div className="text-center mt-3">
          <Link to="/login" className="btn btn-link">
            &larr; Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
