// import React, { useState } from "react";import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// function Booking() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const doctor = location.state;
//   const department=location.state;

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // const email = localStorage.getItem("userEmail");
//   const token = localStorage.getItem("token");;

//   if (!doctor) {
//     return <p>No doctor selected.</p>;
//   }

//   const handleBooking = async () => {
//     if (!date || !time) {
//       alert("Please select both date and time.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       await axios.post(
//         `http://localhost:8000/api/appointments/`,
//         {
//           // email: email,
//           doctor_id: doctor.id,
//           department:department,

//           date: date,
//           time: time,
//         },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );

//       alert(
//         `Booking confirmed with Dr. ${doctor.name} on ${date} at ${time}.`
//       );
//       setDate("");
//       setTime("");
//       navigate("/appointment");
//     } catch (err) {
//       const serverMessage = err.response?.data?.message || "Booking failed.";
//       setError(serverMessage);
//       console.error("Backend error:", err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage:
//           'url("https://bing.com/th/id/OIP.DcaPFbARL2XCZ_jdxfqaKwHaEI?w=306&h=180&c=7&r=0&o=5&cb=thvnextc2&dpr=1.3&pid=1.7")',
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         minHeight: "100vh",
//         paddingTop: "60px",
//         paddingBottom: "60px",
//       }}
//     >
//       <div className="container d-flex justify-content-center align-items-center">
//         <div
//           className="card p-4 shadow"
//           style={{
//             maxWidth: "500px",
//             width: "100%",
//             backgroundColor: "rgba(255, 255, 255, 0.1)",
//             backdropFilter: "blur(6px)",
//             color: "white",
//           }}
//         >
//           <h2 className="text-center mb-4">Book Appointment</h2>
//           <h5>Doctor: {doctor.name}</h5>
//           <p>Department: {doctor.department}</p>

//           <div className="mb-3">
//             <label htmlFor="date" className="form-label">
//               Select Date:
//             </label>
//             <input
//               type="date"
//               id="date"
//               className="form-control"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="time" className="form-label">
//               Select Time:
//             </label>
//             <input
//               type="time"
//               id="time"
//               className="form-control"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//             />
//           </div>

//           {error && <div className="alert alert-danger">{error}</div>}

//           <button
//             className="btn btn-primary w-100"
//             onClick={handleBooking}
//             disabled={loading}
//           >
//             {loading ? "Booking..." : "Book Here"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Booking;



import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state;
  const department = location.state;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  if (!doctor) {
    return <p>No doctor selected.</p>;
  }

  const handleBooking = async () => {
    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      alert("You cannot book appointments before today.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        `http://localhost:8000/api/appointments/`,
        {
          doctor_id: doctor.id,
          department: department,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert(`Booking confirmed with Dr. ${doctor.name} on ${date} at ${time}.`);
      setDate("");
      setTime("");
      navigate("/appointment");
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Booking failed.";
      setError(serverMessage);
      console.error("Backend error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://bing.com/th/id/OIP.DcaPFbARL2XCZ_jdxfqaKwHaEI?w=306&h=180&c=7&r=0&o=5&cb=thvnextc2&dpr=1.3&pid=1.7")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <div className="container d-flex justify-content-center align-items-center">
        <div
          className="card p-4 shadow"
          style={{
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(6px)",
            color: "white",
          }}
        >
          <h2 className="text-center mb-4">Book Appointment</h2>
          <h5>Doctor: {doctor.name}</h5>
          <p>Department: {doctor.department}</p>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // restrict past dates
            />
          </div>

          <div className="mb-3">
            <label htmlFor="time" className="form-label">
              Select Time:
            </label>
            <input
              type="time"
              id="time"
              className="form-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            className="btn btn-primary w-100"
            onClick={handleBooking}
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booking;
