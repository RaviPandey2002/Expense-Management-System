import React from "react";
import { Spin } from "antd";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <Spin size="large" />
    </div>
  );
};

export default Spinner;
