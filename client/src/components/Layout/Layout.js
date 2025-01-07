import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column">
      <Header />
      <div
        className="content py-4 px-5"  
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
