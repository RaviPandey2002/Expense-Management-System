import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, App } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import axios from "axios";

const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setLoginUser(user);
  }, []);

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (_) {
      // proceed with client-side logout even if server call fails
    }
    localStorage.removeItem("user");
    message.success("Logged out successfully");
    navigate("/login");
  };

  const initials = loginUser?.name
    ? loginUser.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        Expense Management
      </Link>

      <div className="app-header__right">
        {loginUser && (
          <>
            <span className="app-header__welcome">
              Welcome, {loginUser.name}
            </span>
            <div className="app-header__avatar" aria-label="User avatar">
              {initials}
            </div>
          </>
        )}
        <Button
          type="default"
          icon={<LogoutOutlined />}
          onClick={logoutHandler}
          aria-label="Logout"
        >
          <span className="app-header__logout-text">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
