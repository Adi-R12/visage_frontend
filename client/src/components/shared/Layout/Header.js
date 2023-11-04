import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // logout handler
  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="container-fluid" style={{ paddingTop: "8px", paddingLeft: "45px", paddingRight: "45px" }}>
          <div className="navbar-brand h1" style={{ fontSize: "28px" }}>
            {/* <img src="/logo192.png" alt="logo" width="43px" height="43px" /> */}
            Visage

          </div>
          <ul className="navbar-nav flex-row" style={{ fontSize: "17.5px", paddingBottom: "8px" }}>
            {user?.role === "user" && (
              <>
                <li className="nav-item mx-3">
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item mx-3">
              <button type="button" class="btn btn-outline-danger btn-sm" style={{ borderRadius: "20px", marginTop: "6px" }} onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav >
    </>
  );
};

export default Header;