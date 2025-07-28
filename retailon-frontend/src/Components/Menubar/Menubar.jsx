import './Menubar.css';
import { assets } from "../../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext.jsx";

const Menubar = () => {
    const navigate = useNavigate();
    const { setAuthData } = useContext(AppContext);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuthData({
            token: null,
            role: null
        });
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2">
            <Link className="navbar-brand" to="#">
                <img src={assets.logo} alt="Logo" height="40" />
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse p-2" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/explore">Explore</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/items">Manage Items</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/category">Manage Categories</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/users">Manage Users</Link>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link dropdown-toggle" id="navbarDropdown" role="button"
                           data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={assets.profile} alt="User" height={32} width={32} className="rounded-circle" />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li>
                                <Link className="dropdown-item" to="/settings">Settings</Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/activity">Activity Log</Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item" onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Menubar;
