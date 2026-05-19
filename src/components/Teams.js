/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import { Link } from "react-router-dom";
import { useAllTeams } from "../api/usePersistedQueries";
import Error from "./Error";
import Loading from "./Loading";
import "./Teams.scss";

function Teams() {
  const { teams, error } = useAllTeams();

  // Handle error and loading conditions
  if (error) {
    return <Error errorMessage={error} />;
  } else if (!teams) {
    return <Loading />;
  }

  // Teams have been populated by AEM GraphQL query. Display the teams.
  return (
    <div className="teams">
      {teams.map((team, index) => {
        return <Team key={index} {...team} />;
      })}
    </div>
  );
}

// Render single Team
function Team({ title, shortName, description, teamMembers, _path }) {
  // Must have title, shortName and at least 1 team member
  if (!title || !shortName || !teamMembers) {
    return null;
  }

  return (
    <div
      className="team"
      data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={title}
    >
      <h2
        className="team__title"
        data-aue-prop="title"
        data-aue-type="text"
        data-aue-label="Team Title"
      >
        {title}
      </h2>
      <p
        className="team__description"
        data-aue-prop="description"
        data-aue-type="richtext"
        data-aue-label="Team Description"
      >
        {description.plaintext}
      </p>
      <div
        data-aue-prop="teamMembers"
        data-aue-type="container"
        data-aue-label="Team Members"
      >
        <h4 className="team__members-title">Members</h4>
        <ul className="team__members">
          {teamMembers.map((teamMember, index) => {
            return (
              <li key={index} className="team__member">
                <Link to={`/person/${teamMember.fullName}`}>
                  {teamMember.fullName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Teams;
