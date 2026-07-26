import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "antd/dist/antd.min.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const is401 = error.response?.status === 401;
    const isAuthRoute = url.includes("/users/login") || url.includes("/users/register");

    if (is401 && !isAuthRoute) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


