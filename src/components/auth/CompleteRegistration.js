import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

export default function CompleteRegistration() {
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext); // add this line

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

      // Save token and user info both in localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Update user in AuthContext so dashboard knows about it
      setUser(data.data.user);

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <h2 className="mb-4 text-center">Complete Registration</h2>
      <form onSubmit={handleComplete} className="border p-4 rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Middle Name</label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>

        {error && <small className="text-danger">{error}</small>}

        <button type="submit" className="btn btn-success w-100">Complete Registration</button>
      </form>
    </div>
  );
}
