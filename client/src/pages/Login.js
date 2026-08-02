import React, { useState } from "react";
import { Form, Input, Button, App, Divider } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/login`,
        values,
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify({ ...data.user, password: "" }));
      message.success("Login successful");
      navigate("/");
    } catch (error) {
      message.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/demo-login`,
        {},
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify({
        ...data.user,
        password: "",
        isDemo: true,
      }));
      message.success("Welcome to the demo!");
      navigate("/");
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to start demo");
    } finally {
      setDemoLoading(false);
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

          <h2 className="auth-card__title">Welcome Back</h2>
          <p className="auth-card__subtitle">Sign in to your account</p>

          <Form layout="vertical" onFinish={submitHandler} requiredMark={false}>
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
                placeholder="name@company.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
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
                {loading ? "Logging in…" : "Login"}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>
            or
          </Divider>

          <Button
            block
            size="large"
            icon={<ThunderboltOutlined />}
            loading={demoLoading}
            onClick={handleDemoLogin}
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
              fontWeight: 600,
            }}
          >
            {demoLoading ? "Setting up demo…" : "Try Demo — No account needed"}
          </Button>

          <p className="auth-card__footer">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
