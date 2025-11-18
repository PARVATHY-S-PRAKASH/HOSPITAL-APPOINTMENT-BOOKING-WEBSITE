// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// function Card() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const doctor = location.state;

  
//   if (!doctor) {
//     return (
//       <div className="container mt-4">
//         <h4>No doctor data available.</h4>
//         <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-5">Doctor Details</h2>
//       <div className="card mx-auto" style={{ maxWidth: "500px" }}>
//         <img
//           src={`http://127.0.0.1:8000${doctor.img}`}  alt={doctor.name} className="card-img-top"
//           style={{ maxHeight: "300px", objectFit: "cover" }}
//         />
//         <div className="card-body">
//           <h4 className="card-title">{doctor.name}</h4>
//           <p className="card-text">
//             <strong>Department:</strong> {doctor.department}
//           </p>
//           <p className="card-text">
//             <strong>Qualification:</strong> {doctor.qualification || "MBBS, MD"}
//           </p>
//           <p className="card-text">
//             <strong>Experience:</strong> {doctor.experience || "10 years"}
//           </p>
//           <button className="btn btn-primary" onClick={() => navigate("/booking", { state: doctor })}>
//             Book Appointment
//           </button>
//         </div>
        
//       </div>
//     </div>
//   );
// }

// export default Card;



import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Card() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state;

  return (
    <div
      style={{
        backgroundImage:
          'url("https://bing.com/th/id/OIP.DcaPFbARL2XCZ_jdxfqaKwHaEI?w=306&h=180&c=7&r=0&o=5&cb=thvnextc2&dpr=1.3&pid=1.7")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <div className="container">
        <button className="btn btn-primary mb-4" onClick={() => navigate(-1)}>
          ← Go Back
        </button>

        {!doctor ? (
          <h4 className="text-white">No doctor data available.</h4>
        ) : (
          <div className="card mx-auto shadow" style={{ maxWidth: "500px" }}>
            <img
              src={`http://127.0.0.1:8000${doctor.img}`}
              alt={doctor.name}
              className="card-img-top"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h4 className="card-title">{doctor.name}</h4>
              <p className="card-text">
                <strong>Department:</strong> {doctor.department}
              </p>
              <p className="card-text">
                <strong>Qualification:</strong> {doctor.qualification || "MBBS, MD"}
              </p>
              <p className="card-text">
                <strong>Experience:</strong> {doctor.experience || "10 years"}
              </p>
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate("/booking", { state: doctor })}
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
