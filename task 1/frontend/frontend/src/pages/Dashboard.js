

import React, { useEffect, useState } from "react";
import API from "../api/api";

function Dashboard() {
  const [data, setData] = useState("");

  useEffect(() => {
    API.get("dashboard/")
      .then((res) => setData(res.data.message))
      .catch(() => alert("Unauthorized ❌"));
  }, []);


    // 🔴 Logout function add பண்ணு
  const handleLogout = () => {
    localStorage.removeItem("token");   // token delete
    window.location.href = "/login";    // redirect
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{data}</h2>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;

