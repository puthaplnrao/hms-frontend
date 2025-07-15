import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

export default function PatientDashboard() {
  // const { user } = useSelector((state) => state.auth);
  const reduxUser = useSelector((state) => state.auth.user);
  const storedUser = localStorage.getItem("user");
  const user = reduxUser || (storedUser && JSON.parse(storedUser));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newTime, setNewTime] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments/mine`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
      setError("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleView = async (appt) => {
    setSelectedAppointment(appt);
    setNewTime(appt.time); // default

    try {
      const res = await axios.get(`${API_URL}/appointments/available-slots`, {
        params: {
          doctorId: appt.doctorId,
          date: appt.date,
        },
      });
      res.data.filter((slot) => !slot.isBooked);
    } catch (err) {
      console.error("Failed to load slots", err);
    }

    setShowModal(true);
  };

  // ✅ Cancel Appointment
  const cancelAppointment = async (id) => {
    try {
      await axios.patch(`${API_URL}/appointments/${id}/cancel`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Refresh appointments
      fetchAppointments();
      setShowModal(false);
      setSuccessMsg("Appointment cancelled successfully.");
    } catch (err) {
      console.error("Cancel error", err);
      setError("Failed to cancel appointment.");
    }
  };

  // ✅ Reschedule
  const reschedule = async () => {
    try {
      await axios.put(
        `${API_URL}/appointments/${selectedAppointment._id}`,
        { time: newTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setShowModal(false);
      setSuccessMsg("Appointment rescheduled.");
      refreshAppointments();
    } catch (err) {
      console.error(err);
      setError("Failed to reschedule.");
    }
  };

  const refreshAppointments = async () => {
    setLoading(true);
    const res = await axios.get(`${API_URL}/appointments/mine`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setAppointments(res.data);
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        🙋 Welcome {user.profile?.fullName || user.email}
      </h2>
      <h5 className="mb-3">📋 Recent Appointments</h5>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-muted">No appointments found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, idx) => (
              <tr key={appt._id}>
                <td>{idx + 1}</td>
                <td>{appt.doctorName}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  <span className="badge bg-success">{appt.status}</span>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleView(appt)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ✅ Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Doctor:</strong> {selectedAppointment?.doctorName}
          </p>
          <p>
            <strong>Date:</strong> {selectedAppointment?.date}
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Change Time</Form.Label>
            <Form.Control
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => cancelAppointment(selectedAppointment._id)}
          >
            Cancel Appointment
          </Button>
          <Button variant="success" onClick={reschedule}>
            Change Slot
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
