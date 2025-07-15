import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

function Appointment() {
  const { user } = useSelector((state) => state.auth);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  // ✅ Fetch all doctors
  useEffect(() => {
    axios
      .get(`${API_URL}/users/doctors`)
      .then((res) => setDoctors(res.data))
      .catch(() => setError("Failed to fetch doctors"));
  }, [API_URL]);

  // ✅ Fetch available slots
  const fetchSlots = async () => {
    if (!selectedDoctor || !date) {
      setError("Please select doctor and date");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/appointments/available-slots`, {
        params: { doctorId: selectedDoctor, date },
      });
      setSlots(res.data);
    } catch (err) {
      setError("Error fetching slots");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Book Appointment
  const bookAppointment = async (time) => {
    try {
      setBookingLoading(true);
      setError("");
      setSuccessMsg("");

      await axios.post(`${API_URL}/appointments/book`, {
        doctorId: selectedDoctor,
        date,
        time,
        patientId: user.id,
      });

      setSuccessMsg("Appointment booked successfully!");
      await fetchSlots(); // Refresh slots after booking
    } catch (err) {
      setError(err?.response?.data?.message || "Error booking appointment.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h3>📅 Book Appointment</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.profile?.fullName || doc.email}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-primary w-100"
              onClick={fetchSlots}
              disabled={loading}
            >
              {loading ? "Loading..." : "Check Slots"}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}
        {successMsg && (
          <div className="alert alert-success py-2 text-center">
            {successMsg}
          </div>
        )}

        <div className="row">
          {slots.length === 0 && !loading && (
            <p className="text-muted">No slots found for selected date.</p>
          )}
          {slots.map((slot, i) => {
            const fullDateTime = new Date(`${date}T${slot.time}:00`);
            return (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-2" key={i}>
                <button
                  className={`btn w-100 ${
                    slot.isBooked ? "btn-secondary" : "btn-outline-success"
                  }`}
                  disabled={slot.isBooked || bookingLoading}
                  onClick={() => bookAppointment(slot.time)}
                >
                  {fullDateTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Appointment;
