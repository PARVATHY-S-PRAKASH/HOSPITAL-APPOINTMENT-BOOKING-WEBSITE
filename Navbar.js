import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
    const [user, setUser] = useState(null); // Simulate login state
    const navigate = useNavigate();

    // Simulate loading user from localStorage (if previously logged in)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const logoutHandler = async () => {
        if (user) {
            try {
                await axios.post(
                    "https://demo-blog.mashupstack.com/api/logout",
                    {},
                    {
                        headers: { Authorization: "Bearer " + user.token },
                    }
                );
            } catch (error) {
                console.error("Logout failed", error);
            }

            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand">
                    Well Care
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink to="/home" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/list" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                                Doctor Directory
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/appointment" className="nav-link">
                                My Appointments
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/password" className="nav-link">
                                Reset Password
                            </NavLink>
                        </li>
                        {/* <li className="nav-item">
                            <NavLink to="/register" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                                Register
                            </NavLink>
                        </li> */}
                        {user ? (
                            <li className="nav-item">
                                <span className="nav-link" style={{ cursor: "pointer" }} onClick={logoutHandler}>
                                    Login
                                </span>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <NavLink to="/login" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                                    Logout
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
