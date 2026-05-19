/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../images/wknd-icon.svg";
import "./Nav.scss";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav__bar">
        <Link to="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
          <img src={logo} className="nav__logo" alt="WKND Logo" />
          <span className="nav__brand-name">WKND</span>
        </Link>

        <button
          className={`nav__hamburger${menuOpen ? " nav__hamburger--open" : ""}`}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav__links${menuOpen ? " nav__links--open" : ""}`}>
          <NavLink
            to="/adventures"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " nav__link--active" : "")
            }
            onClick={() => setMenuOpen(false)}
          >
            Adventures
          </NavLink>
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " nav__link--active" : "")
            }
            onClick={() => setMenuOpen(false)}
          >
            Magazine
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " nav__link--active" : "")
            }
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
        </nav>
      </div>
      <hr className="nav__rule" />
    </header>
  );
}

export default Nav;
