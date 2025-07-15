import React, { useState, useEffect } from "react";
import { register } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [responseType, setResponseType] = useState(""); // "success" or "error"

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get role from query string
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");
  console.log(role);
  // ✅ Redirect to home if invalid role
  useEffect(() => {
    if (!["doctor", "patient"].includes(role)) {
      navigate("/");
    }
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setResponseMsg("");
    setResponseType("");

    try {
      const profile = { fullName, age, gender } || {};
      const res = await register({ email, password, role, profile });

      setResponseType("success");
      setResponseMsg(res?.data?.message || "Registration successful!");

      setTimeout(() => navigate(`/login?role=${role}`), 1500);
    } catch (err) {
      const error =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setResponseType("error");
      setResponseMsg(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-3">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
        </div>
        <h4 className="text-center mb-3">
          {role === "doctor" ? "Doctor Registration" : "Patient Registration"}
        </h4>

        {/* ✅ API Message */}
        {responseMsg && (
          <div
            className={`alert alert-${
              responseType === "success" ? "success" : "danger"
            } py-2 text-center`}
          >
            {responseMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={fullName || ""}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Age"
              value={age || ""}
              onChange={(e) => setAge(e.target.value)}
              min={0}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-control"
              value={gender || ""}
              onChange={(e) => setGender(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
            ) : null}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account? <a href={`/login?role=${role}`}>Login</a>
          </small>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-2">
          <button
            onClick={() => navigate("/")}
            className="btn btn-link text-decoration-none"
          >
            ← Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
