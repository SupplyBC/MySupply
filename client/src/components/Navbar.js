import React from "react";
import { BrowserRouter, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <BrowserRouter>
      <div className="navbar-container">
        <ul className="nav-list">
          <NavLink to="/inventory"> GO TO INVENTORY </NavLink>
          <li className="nav-item">
            {" "}
            <a href="/">SUPPLY</a>{" "}
          </li>
          <li className="nav-item">
            {" "}
            <a href="/">TRACK</a>{" "}
          </li>
          <li className="nav-item">
            {" "}
            <a href="/">FINANCE</a>{" "}
          </li>
          <li className="nav-item">
            {" "}
            <a href="/">INVENTORY</a>{" "}
          </li>
        </ul>
      </div>
    </BrowserRouter>
  );
}

export default Navbar;
