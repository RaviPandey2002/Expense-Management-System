import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div class="d-flex flex-column min-vh-100">
      <Header />
      <div className="content flex-grow-1 container py-4 px-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
