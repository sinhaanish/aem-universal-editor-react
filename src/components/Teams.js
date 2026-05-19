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

  if (error) {
    return <Error errorMessage={error} />;
  } else if (!teams) {
    return <Loading />;
  }

  return (
    <div className="teams">
      {teams.map((team, index) => {
        return <Team key={index} {...team} />;
      })}
    </div>
  );
}

function Team({ _path, title, shortName, description, teamMembers }) {
  if (!title || !shortName || !teamMembers) {
    return null;
  }

  return (
    // Universal Editor: marks this element as an editable Content Fragment reference
    <div
      className="team"
      data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={title}
    >
      {/* Universal Editor: inline-editable text field mapped to the 'title' CF property */}
      <h2
        className="team__title"
        data-aue-prop="title"
        data-aue-type="text"
        data-aue-label="Title"
      >
        {title}
      </h2>

      {/* Universal Editor: inline-editable rich text field mapped to 'description' */}
      <p
        className="team__description"
        data-aue-prop="description"
        data-aue-type="richtext"
        data-aue-label="Description"
      >
        {description.plaintext}
      </p>

      <div>
        <h4 className="team__members-title">Members</h4>
        <ul className="team__members">
          {teamMembers.map((teamMember, index) => {
            return (
              // Universal Editor: each member link references the Person CF directly
              <li
                key={index}
                className="team__member"
                data-aue-resource={`urn:aemconnection:${teamMember._path}/jcr:content/data/master`}
                data-aue-type="reference"
                data-aue-label={teamMember.fullName}
              >
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
