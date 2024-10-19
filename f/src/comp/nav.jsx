import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function Nav() {
  return (
    <div className="flex row w-[100%] justify-between bg-[#074681] text-white font-medium text-[30px] test-bold px-[20%] py-[20px]">
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/detail">Detail</Link>
      </div>
      <div>
        <Link to="/ask">Ask</Link>
      </div>
    </div>
  );
}

export default Nav;
