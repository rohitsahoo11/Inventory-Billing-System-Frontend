import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useSelector } from "react-redux";

const ProtectedLayout = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
    //return null;
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
