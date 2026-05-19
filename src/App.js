/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import AdventuresPage from "./components/AdventuresPage";
import Adventure from "./components/Adventure";
import Articles from "./components/Articles";
import Article from "./components/Article";
import About from "./components/About";
import "./App.scss";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adventures" element={<AdventuresPage />} />
            <Route path="/adventure/:slug" element={<Adventure />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
