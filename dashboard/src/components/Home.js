import React, { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    axios
      .post("https://zerodha-backend-mhhn.onrender.com/", {}, { withCredentials: true })
      .then((res) => {
        if (res.data.status) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          window.location.href = "https://zerodha-clone-a6lg.onrender.com/login"; // 👈 redirect
        }
      })
      .catch(() => {
        setIsAuth(false);
        window.location.href = "https://zerodha-clone-a6lg.onrender.com/login";
      });
  }, []);

  // ⏳ loading state
  if (isAuth === null) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
