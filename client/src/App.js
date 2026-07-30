import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";

const theme = {
  token: {
    colorPrimary: "#4F46E5",
    colorSuccess: "#16a34a",
    colorError: "#dc2626",
    borderRadius: 6,
    fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <HomePage />
              </ProtectedRoutes>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
