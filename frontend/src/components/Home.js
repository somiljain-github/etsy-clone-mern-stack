import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>Home</div>
    </div>
  );
}

export default Home;
