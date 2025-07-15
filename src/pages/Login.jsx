import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../services/authService";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get role from query param
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");

  // ✅ Redirect if role is not valid
  useEffect(() => {
    if (!["doctor", "patient"].includes(role)) {
      navigate("/"); // redirect to home
    }
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await login({ email, password, role }); // send role to backend
      dispatch(loginSuccess(res.data));
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Invalid credentials. Please try again.";
      setErrorMsg(msg);
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

        <h4 className="text-center mb-3 text-primary">
          {role === "doctor" ? "Doctor Login" : "Patient Login"}
        </h4>

        {errorMsg && (
          <div className="alert alert-danger text-center py-2">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit}>
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
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <a href={`/register?role=${role}`} className="text-decoration-none">
              Register
            </a>
          </small>
        </div>

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

export default Login;
