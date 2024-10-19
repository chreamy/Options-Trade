// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Detail from "./pages/detail";
import Ask from "./pages/ask";
import "./App.css";
import Nav from "./comp/nav";

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/ask" element={<Ask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
