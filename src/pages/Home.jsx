import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ✅ Header */}
      <header className="bg-white border-bottom py-3 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/logo.png"
              alt="Hospital Logo"
              style={{ width: "40px", height: "40px", objectFit: "contain" }}
            />
            <h5 className="mb-0 text-primary">HealthCare Portal</h5>
          </div>

          <div>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => navigate("/login?role=patient")}
            >
              Patient Login
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/login?role=doctor")}
            >
              Doctor Login
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Main Content */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center px-3">
          <h2 className="mb-3 text-primary">Welcome to HealthCare Portal</h2>
          <p className="text-muted fs-5">
            Manage appointments, records & health info securely.
          </p>
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="bg-white text-center py-3 border-top text-muted small">
        <div>
          &copy; {new Date().getFullYear()} HealthCare Portal. All rights
          reserved. |
          <a href="/public-health-info" className="ms-1 text-decoration-none">
            Health Info
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
