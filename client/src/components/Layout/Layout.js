import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div
        className="content py-4 px-5 flex-grow-1"  
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
