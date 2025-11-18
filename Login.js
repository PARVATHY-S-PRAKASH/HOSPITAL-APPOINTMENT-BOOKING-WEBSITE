import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const attemptLogin = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/adminlogin/', { email, password })
      .then((response) => {
        setErrorMessage('');
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        navigate('/home');
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Failed to login. Please try again.');
        }
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: 'url("https://bing.com/th/id/OIP.DcaPFbARL2XCZ_jdxfqaKwHaEI?w=306&h=180&c=7&r=0&o=5&cb=thvnextc2&dpr=1.3&pid=1.7")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div
        className="container p-5 rounded"
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "transparent", // removed white background
          color: "white" // ensure text is visible
        }}
      >
        <h1 className="text-center mb-4">Login</h1>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={attemptLogin}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: "#ffffffcc",
                color: "#000",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "6px"
              }} />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "#ffffffcc",
                color: "#000",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "6px"
              }}/>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <p className="mt-3 text-center text-white">
          Don't have an account? <Link to="/register" className="text-info">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
