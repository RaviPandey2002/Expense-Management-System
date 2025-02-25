import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/RegisterPage.css";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const URL = `${process.env.REACT_APP_API_BASE_URL}/users/register`;
      console.log("URL:", URL);

      await axios.post(URL, values);

      message.success("Registered Successfully");
      setLoading(false);
      navigate("/login");

      console.log("FORM data submitted!");
    } catch (error) {
      setLoading(false);
      console.log('Error while registering user. Error: ', error?.response?.data?.message || error.message)
      const msg = error?.response?.data?.message || "Something went wrong!!"
      message.error(msg);
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="register-page ">
        {loading && <Spinner />}
        <Form
          className="register-form"
          layout="vertical"
          onFinish={submitHandler}
        >
          <h2>Register Form</h2>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <Link to="/login">Already Register? login here!</Link>
            <button className="btn ">Register</button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
