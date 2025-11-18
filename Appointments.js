import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";

function Appointment() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/my_appointments/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch appointments:", error);
      });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = appointments
    .filter((a) => new Date(a.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const previous = appointments
    .filter((a) => new Date(a.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCancel = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://127.0.0.1:8000/api/cancel/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        setAppointments((prev) => prev.filter((app) => app.id !== id));
      })
      .catch((error) => {
        alert("Failed to cancel appointment");
        console.error(error);
      });
  };

   return (
    <div
      style={{
        backgroundImage: 'url("data:image/jpeg;base64,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")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Navbar />
      <div
        className="container mt-5 p-4 rounded shadow"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(6px)",
          color: "white",
        }}
      >
        <h2 className="mb-4 text-center">Your Appointments</h2>

        {/* Upcoming Appointments */}
        <h4 className="mt-5">Upcoming Appointments</h4>
        <div className="row">
          {upcoming.length > 0 ? (
            upcoming.map((app) => (
              <div className="col-md-4 mb-3" key={app.id}>
                <div className="card shadow-sm" style={{ backgroundColor: "#ffffffcc" }}>
                  <div className="card-body">
                    <h5 className="card-title text-dark">Dr. {app.doctor?.name || "N/A"}</h5>
                    <p className="card-text text-dark">
                      <strong>Department:</strong> {app.doctor?.department || "N/A"} <br />
                      <strong>Date:</strong> {app.date} <br />
                      <strong>Time:</strong> {app.time}
                    </p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(app.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </div>

        {/* Previous Appointments */}
        <h4 className="mt-5">Previous Appointments</h4>
        <div className="row">
          {previous.length > 0 ? (
            previous.map((app) => (
              <div className="col-md-4 mb-3" key={app.id}>
                <div className="card shadow-sm border-secondary" style={{ backgroundColor: "#ffffffcc" }}>
                  <div className="card-body">
                    <h5 className="card-title text-dark">Dr. {app.doctor?.name || "N/A"}</h5>
                    <p className="card-text text-dark">
                      <strong>Department:</strong> {app.doctor?.department || "N/A"} <br />
                      <strong>Date:</strong> {app.date} <br />
                      <strong>Time:</strong> {app.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No previous appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointment;