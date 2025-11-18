
import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await axios.put(
        "http://127.0.0.1:8000/api/reset_password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100vh" }}>
        {/* Left Side - Smaller Image */}
        <div
          className="d-none d-md-block"
          style={{
            flex: "0 0 30%",
            backgroundImage:
              'url("https://bing.com/th/id/OIP.KVT93jidPA7E5SHtEEqRCQHaHa?w=194&h=194&c=7&r=0&o=5&cb=thvnextc2&dpr=1.3&pid=1.7")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Right Side - Plain Form */}
        <div className="flex-fill d-flex align-items-center justify-content-center p-4">
          <div className="w-100" style={{ maxWidth: "500px" }}>
            <h2 className="mb-5 text-center">Update Password</h2><br></br>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleUpdatePassword}>
              <div className="mb-5">
                <input
                  type="password"
                  className="form-control"
                  value={oldPassword}
                  placeholder="Current Password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdatePassword;
