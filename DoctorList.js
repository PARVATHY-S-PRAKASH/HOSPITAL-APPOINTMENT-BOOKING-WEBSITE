import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [dept, setDept] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [all, setAll] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/management/')
      .then(response => {
        setDoctors(response.data);
        setErrorMessage('');
      })
      .catch(error => {
        setErrorMessage('Failed to fetch doctor list');
        console.error(error);
      });
  }, []);

  const filteredDoctors = all
    ? doctors
    : doctors.filter(doc => doc.department === dept);

  return (
    <>
      <Navbar />

      <div
        style={{
          backgroundImage: 'url("https://bing.com/th/id/OIP.gr-bcxttSXL2qvgukVPNIgHaDI?w=263&h=180&c=7&r=0&o=5&cb=thvnextc2&dpr=1.3&pid=1.7")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          paddingTop: "30px",
          paddingBottom: "60px",
          color: "black"
        }}
      >
        <div className="container mt-4">
          <h2 className="mb-4 text-center">Your Doctors & Appointment</h2>

          {errorMessage && (
            <div className="alert alert-danger bg-danger text-white">
              {errorMessage}
            </div>
          )}

          <div className="mb-4 d-flex align-items-center gap-2 mt-3">
            <button className="btn btn-primary" onClick={() => setAll(true)}>
              All
            </button>

            <select
              className="form-select w-auto"
              value={dept}
              onChange={(e) => {
                setDept(e.target.value);
                setAll(false);
              }}
            >
              <option value="">Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="ENT">ENT</option>
              <option value="Physician">Physician</option>
            </select>
          </div>

          <div className="row">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="col-md-4 col-lg-3 mb-4"
                onClick={() => navigate("/card", { state: doc })}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card h-100 shadow"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(6px)",
                    color: "black",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000${doc.img}`}
                    className="card-img-top"
                    alt={doc.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{doc.name}</h5>
                    <p className="card-text">{doc.department}</p>
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/booking", { state: doc });
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorList;
