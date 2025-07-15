import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

export default function DoctorDashboard() {
  // const { user } = useSelector((state) => state.auth);
  const reduxUser = useSelector((state) => state.auth.user);
  const storedUser = localStorage.getItem("user");
  const user = reduxUser || (storedUser && JSON.parse(storedUser));
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Doctor Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const [apptRes, patientRes] = await Promise.all([
          axios.get(`${API_URL}/doctor/appointments/today`, { headers }),
          axios.get(`${API_URL}/doctor/patients/recent`, { headers }),
        ]);

        setTodayAppointments(apptRes.data);
        setRecentPatients(patientRes.data);
      } catch (err) {
        console.error("Error loading dashboard data", err);
        setError("Failed to load doctor dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        👨‍⚕️ Welcome Dr. {user.profile?.fullName || user.email}
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          {/* ✅ Today's Appointments */}
          <h5 className="mb-3">📅 Today's Appointments</h5>
          {todayAppointments.length === 0 ? (
            <p className="text-muted">No appointments for today.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Time</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((appt, idx) => (
                  <tr key={appt.id}>
                    <td>{idx + 1}</td>
                    <td>{appt.patient}</td>
                    <td>{appt.time}</td>
                    <td>{appt.reason}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* ✅ Recent Patients */}
          <h5 className="mt-5 mb-3">🧾 Recent Patients</h5>
          {recentPatients.length === 0 ? (
            <p className="text-muted">No recent patients.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Last Visit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.lastVisit}</td>
                    <td>
                      <Button variant="primary" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}
