/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import logo from "./images/wknd-icon.svg";
import Home from "./components/Home";
import Person from "./components/Person";
import "./App.scss";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Helmet>
            {/* Universal Editor CORS library — enables in-context editing */}
            <script
              src="https://universal-editor-service.adobe.io/cors.js"
              async
            />
            {/* AEM connection metadata */}
            <meta
              name="urn:adobe:aue:system:aem"
              content={`aem:${process.env.REACT_APP_HOST_URI}`}
            />
            {/* Universal Editor Service connection */}
            <meta
              name="urn:adobe:aue:config:service"
              content={process.env.REACT_APP_UE_SERVICE_URI || "https://localhost:8001"}
            />
          </Helmet>
          <header>
            <Link to={"/"}>
              <img src={logo} className="logo" alt="WKND Logo" />
            </Link>
            <hr />
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/person/:fullName" element={<Person />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
