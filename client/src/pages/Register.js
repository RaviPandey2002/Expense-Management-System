import React, { useState } from "react";
import { Form, Input, Button, App } from "antd";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/register`,
        values
      );
      message.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      message.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("user")) return <Navigate to="/" replace />;

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card__brand">
            <h1 className="auth-card__brand-title">Expense Management</h1>
            <p className="auth-card__brand-tagline">Track your money, own your future.</p>
          </div>

          <h2 className="auth-card__title">Create Account</h2>
          <p className="auth-card__subtitle">Start tracking your expenses today</p>

          <Form layout="vertical" onFinish={submitHandler} requiredMark={false}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="John Doe" size="large" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                type="email"
                placeholder="john@example.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {loading ? "Creating account…" : "Register"}
              </Button>
            </Form.Item>
          </Form>

          <p className="auth-card__footer">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
