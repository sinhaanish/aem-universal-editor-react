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

function AdventuresPage() {
  return (
    <div className="home">
      <div className="home__section-header" style={{ marginBottom: "1.5rem" }}>
        <h2 className="home__section-title">All Adventures</h2>
      </div>
      <Adventures />
    </div>
  );
}

export default AdventuresPage;
