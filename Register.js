import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  function registerUser() {
    // Simple client-side check
    if (password !== passwordConf) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password,
      dob: dob,
      gender:gender,
      address: address,
      contactno: phone
    };

    axios.post('http://127.0.0.1:8000/api/signup/', user)
      .then(() => {
        setErrorMessage('');
        navigate('/login');
      })
      .catch(error => {
        if (error.response?.data?.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Failed to connect to API');
        }
      });
  }

  return (
    <>
      
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: 'url("https://bing.com/th/id/OIP.KDWdmfmhhOhbX_yQ4j-gkQHaD4?w=345&h=181&c=7&r=0&o=5&cb=thvnextc2&dpr=1.3&pid=1.7")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div
          className="p-5 rounded shadow"
          style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(6px)",
            color: "white"
          }}
        >
          <h2 className="text-center mb-4">Register</h2>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <div className="form-group mb-3">
            <input
              type="text"
              placeholder="Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="date"
              className="form-control"
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="form-group mb-3 text-white">
            Gender:
            <div className="form-check form-check-inline ms-3">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label">Male</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label">Female</label>
            </div>
          </div>

          <div className="form-group mb-3">
            <textarea
              className="form-control"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="tel"
              placeholder="Phone"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={registerUser}>
            Submit
          </button>

          <p className="mt-3 text-center text-white">
            Already have an account? <Link to="/login" className="text-info">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  backgroundColor: "#ffffffcc",
  color: "#000",
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "6px"
};

export default Register;