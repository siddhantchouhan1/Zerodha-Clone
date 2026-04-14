import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // ✅ USER FETCH
  useEffect(() => {
    axios
      .post("http://localhost:3002/", {}, { withCredentials: true })
      .then((res) => {
        if (res.data.status) {
          setUsername(res.data.user);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3002/logout",
        {},
        { withCredentials: true }
      );

      // redirect to login
      window.location.href = "http://localhost:3000/login";
    } catch (err) {
      console.log(err);
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link to="/" onClick={() => handleMenuClick(0)}>
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link to="/orders" onClick={() => handleMenuClick(1)}>
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link to="/holdings" onClick={() => handleMenuClick(2)}>
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link to="/positions" onClick={() => handleMenuClick(3)}>
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link to="funds" onClick={() => handleMenuClick(4)}>
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>

          <li>
            <Link to="/apps" onClick={() => handleMenuClick(6)}>
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>

        <hr />

        {/* ✅ PROFILE SECTION */}
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
          <p className="username">
            {username ? username : "Loading..."}
          </p>

          {/* ✅ LOGOUT BUTTON */}
          {isProfileDropdownOpen && (
            <button  className="logoutsid"
              onClick={handleLogout}
             
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;