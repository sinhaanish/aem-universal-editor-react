/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import "./About.scss";

function About() {
  return (
    <div className="about">
      <div className="about__hero">
        <h1 className="about__headline">We Live for Adventure</h1>
        <p className="about__tagline">
          WKND is a global community of outdoor enthusiasts, storytellers, and explorers.
        </p>
      </div>

      <div className="about__content">
        <section className="about__section">
          <h2 className="about__section-title">Our Mission</h2>
          <p>
            Founded in 2015, WKND exists to inspire people to step outside, push their
            limits, and discover the world's most extraordinary places. From Himalayan
            treks to ocean surfs, we curate adventures that challenge and transform.
          </p>
          <p>
            Every trip we offer is designed by people who've done it themselves — guides,
            photographers, athletes, and writers who bring the world alive through
            first-hand experience.
          </p>
        </section>

        <div className="about__values">
          {[
            {
              icon: "🌍",
              title: "Sustainable Travel",
              body: "We partner only with operators who meet our strict environmental and community standards. Adventure should leave the world better than we found it.",
            },
            {
              icon: "🤝",
              title: "Community First",
              body: "WKND started as a weekend hiking group and still runs that way — every explorer, writer, and guide is part of the same community.",
            },
            {
              icon: "📸",
              title: "Authentic Stories",
              body: "Our magazine publishes real experiences from real travellers. No sponsored fluff — just honest, inspiring storytelling.",
            },
            {
              icon: "🏔️",
              title: "Expert Curation",
              body: "Every adventure in our catalogue has been personally vetted. We cap group sizes, select local guides, and obsess over logistics so you can focus on the experience.",
            },
          ].map(({ icon, title, body }) => (
            <div className="about__value" key={title}>
              <span className="about__value-icon">{icon}</span>
              <h3 className="about__value-title">{title}</h3>
              <p className="about__value-body">{body}</p>
            </div>
          ))}
        </div>

        <section className="about__section about__section--team">
          <h2 className="about__section-title">The Team</h2>
          <p>
            We're a remote-first team of 45 spread across 12 countries. Our headquarters
            is wherever the best adventure is happening that week — though our servers
            live in California.
          </p>
          <p>
            Want to write for us, guide an adventure, or just say hello?{" "}
            <a className="about__link" href="mailto:hello@wknd.site">
              hello@wknd.site
            </a>
          </p>
        </section>

        <section className="about__stats">
          {[
            { value: "200+", label: "Adventures worldwide" },
            { value: "80k", label: "Travellers per year" },
            { value: "48", label: "Countries covered" },
            { value: "9 yrs", label: "In the field" },
          ].map(({ value, label }) => (
            <div className="about__stat" key={label}>
              <span className="about__stat-value">{value}</span>
              <span className="about__stat-label">{label}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default About;
