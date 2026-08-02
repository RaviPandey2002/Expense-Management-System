import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, App, Modal, Form, Input, Divider } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [clearDemoModal, setClearDemoModal] = useState(false);
  const [clearDemoLoading, setClearDemoLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [pwdForm] = Form.useForm();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setLoginUser(user);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoutHandler = async () => {
    setDropdownOpen(false);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (_) {}
    localStorage.removeItem("user");
    message.success("Logged out successfully");
    navigate("/login");
  };

  const updatePasswordHandler = async (values) => {
    try {
      setPwdLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/users/update-password`,
        { currentPassword: values.currentPassword, newPassword: values.newPassword },
        { withCredentials: true }
      );
      message.success("Password updated successfully");
      pwdForm.resetFields();
      setPasswordModal(false);
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  const openModal = (setter) => {
    setDropdownOpen(false);
    setter(true);
  };

  const clearDemoDataHandler = async () => {
    try {
      setClearDemoLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/transactions/delete-all-transactions`,
        {},
        { withCredentials: true }
      );
      message.success("All demo transactions cleared");
      setClearDemoModal(false);
      window.location.reload();
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to clear demo data");
    } finally {
      setClearDemoLoading(false);
    }
  };

  const isDemo = !!loginUser?.isDemo;

  const initials = loginUser?.name
    ? loginUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const menuItems = [
    ...(!isDemo ? [
      {
        icon: <UserOutlined />,
        label: "View Profile",
        action: () => openModal(setProfileModal),
      },
      {
        icon: <LockOutlined />,
        label: "Update Password",
        action: () => openModal(setPasswordModal),
      },
      {
        icon: <SettingOutlined />,
        label: "Preferences",
        action: () => message.info("Preferences coming soon"),
        muted: true,
      },
      { divider: true },
    ] : [
      {
        icon: <DeleteOutlined />,
        label: "Clear Demo Data",
        action: () => openModal(setClearDemoModal),
        danger: true,
        extraClass: "avatar-dropdown__item--clear-demo",
      },
      { divider: true },
    ]),
    {
      icon: <InfoCircleOutlined />,
      label: "About Us",
      action: () => openModal(setAboutModal),
    },
    {
      icon: <QuestionCircleOutlined />,
      label: "Help & Support",
      action: () => openModal(setHelpModal),
    },
    { divider: true },
    {
      icon: <LogoutOutlined />,
      label: "Logout",
      action: logoutHandler,
      danger: true,
    },
  ];

  return (
    <>
      <header className="app-header">
        <Link to="/" className="app-header__brand">
          <img
            src="/images/favicon.ico"
            alt="logo"
            className="app-header__logo"
          />
          Expense Management
        </Link>

        <div className="app-header__right">
          {loginUser && (
            <>
              {isDemo && (
                <span className="demo-session-badge">
                  ⚡ Demo Session
                </span>
              )}
              {isDemo && (
                <button
                  className="header-clear-demo-btn"
                  onClick={() => setClearDemoModal(true)}
                  aria-label="Clear demo data"
                >
                  <DeleteOutlined />
                  <span>Clear Demo Data</span>
                </button>
              )}
              <span className="app-header__welcome">
                Welcome, {loginUser.name}
              </span>

              <div className="app-header__avatar-wrap" ref={dropdownRef}>
                <button
                  className="app-header__avatar"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  {initials}
                </button>

                {dropdownOpen && (
                  <div className="avatar-dropdown" role="menu">
                    <div className="avatar-dropdown__header">
                      <div className="avatar-dropdown__avatar-lg">{initials}</div>
                      <div>
                        <div className="avatar-dropdown__name">{loginUser.name}</div>
                        <div className="avatar-dropdown__email">{loginUser.email}</div>
                      </div>
                    </div>
                    <div className="avatar-dropdown__divider" />

                    {menuItems.map((item, i) =>
                      item.divider ? (
                        <div key={`div-${i}`} className="avatar-dropdown__divider" />
                      ) : (
                        <button
                          key={item.label}
                          className={`avatar-dropdown__item${item.danger ? " avatar-dropdown__item--danger" : ""}${item.muted ? " avatar-dropdown__item--muted" : ""}${item.extraClass ? ` ${item.extraClass}` : ""}`}
                          role="menuitem"
                          onClick={item.action}
                        >
                          <span className="avatar-dropdown__item-icon">{item.icon}</span>
                          {item.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </header>

      <Modal
        open={profileModal}
        onCancel={() => setProfileModal(false)}
        footer={null}
        title={null}
        centered
        width={400}
        className="profile-modal"
      >
        <div className="profile-modal__body">
          <div className="profile-modal__avatar">{initials}</div>
          <h3 className="profile-modal__name">{loginUser?.name}</h3>
          <p className="profile-modal__email">{loginUser?.email}</p>
          <Divider />
          <div className="profile-modal__meta">
            <div className="profile-modal__meta-row">
              <span className="profile-modal__meta-label">Role</span>
              <span className="profile-modal__meta-value">Account Owner</span>
            </div>
            <div className="profile-modal__meta-row">
              <span className="profile-modal__meta-label">Status</span>
              <span className="profile-modal__meta-value profile-modal__meta-value--active">● Active</span>
            </div>
            {loginUser?.createdAt && (
              <div className="profile-modal__meta-row">
                <span className="profile-modal__meta-label">Member since</span>
                <span className="profile-modal__meta-value">
                  {new Date(loginUser.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={passwordModal}
        onCancel={() => { setPasswordModal(false); pwdForm.resetFields(); }}
        title="Update Password"
        footer={null}
        centered
        width={420}
      >
        <Form
          form={pwdForm}
          layout="vertical"
          onFinish={updatePasswordHandler}
          requiredMark={false}
          style={{ marginTop: 8 }}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 4 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={pwdLoading}>
              {pwdLoading ? "Updating…" : "Update Password"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={aboutModal}
        onCancel={() => setAboutModal(false)}
        footer={null}
        title={null}
        centered
        width={520}
        className="about-modal"
      >
        <div className="about-modal__body">
          <div className="about-modal__badge">v1.0</div>
          <h2 className="about-modal__title">Expense Management System</h2>
          <p className="about-modal__tagline">Track your money. Own your future.</p>
          <p className="about-modal__desc">
            A full-stack personal finance platform built to give you complete clarity over
            where your money goes. Log income and expenses, visualise spending patterns through
            interactive charts, filter transactions by date range or category, and stay in
            control of your financial story — all from a clean, distraction-free interface.
          </p>
          <div className="about-modal__features">
            <div className="about-modal__feature">Smart transaction tracking</div>
            <div className="about-modal__feature">Income vs expense analytics</div>
            <div className="about-modal__feature">Category-level breakdowns</div>
            <div className="about-modal__feature">Secure JWT authentication</div>
          </div>
          <p className="about-modal__footer-note">
            Built with React, Ant Design, Node.js &amp; MongoDB.
          </p>
        </div>
      </Modal>

      <Modal
        open={helpModal}
        onCancel={() => setHelpModal(false)}
        title="Help & Support"
        footer={null}
        centered
        width={460}
      >
        <div className="help-modal__body">
          <div className="help-modal__section">
            <h4 className="help-modal__section-title">Getting Started</h4>
            <p>Use the <strong>+ Add Transaction</strong> button to log a new income or expense entry. Select the type, fill in the amount, category, and date — and you're done.</p>
          </div>
          <div className="help-modal__section">
            <h4 className="help-modal__section-title">Filtering</h4>
            <p>Use the toolbar filters to narrow transactions by date range, type (income/expense), or frequency. The analytics tab updates automatically.</p>
          </div>
          <div className="help-modal__section">
            <h4 className="help-modal__section-title">Analytics</h4>
            <p>Switch to the <strong>Analytics</strong> tab to see doughnut charts breaking down your spending and income by category.</p>
          </div>
          <div className="help-modal__section">
            <h4 className="help-modal__section-title">Account Issues</h4>
            <p>To change your password, use <strong>Update Password</strong> from the profile menu. If you're locked out, try registering with the same email again.</p>
          </div>
        </div>
      </Modal>

      <Modal
        open={clearDemoModal}
        onCancel={() => setClearDemoModal(false)}
        title="Clear Demo Data"
        centered
        width={420}
        footer={[
          <Button key="cancel" onClick={() => setClearDemoModal(false)} disabled={clearDemoLoading}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            loading={clearDemoLoading}
            onClick={clearDemoDataHandler}
          >
            {clearDemoLoading ? "Clearing…" : "Yes, clear all"}
          </Button>,
        ]}
      >
        <p style={{ margin: "12px 0" }}>
          This will permanently delete all <strong>seeded demo transactions</strong> for this session.
          You can still add your own transactions afterwards.
        </p>
        <p style={{ margin: 0, color: "#57606a", fontSize: "0.875rem" }}>
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default Header;
