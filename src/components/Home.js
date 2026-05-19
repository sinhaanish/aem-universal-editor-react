/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import Adventures from "./Adventures";
import "./Home.scss";

function Home() {
  return (
    <div className="home">
      <h2 className="home__title">WKND Adventures</h2>
      <p className="home__subtitle">Explore our curated collection of outdoor adventures around the world.</p>
      <Adventures />
    </div>
  );
}

export default Home;
