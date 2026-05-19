/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import { useParams } from "react-router-dom";
import { usePersonByName } from "../api/usePersistedQueries";
import { mapJsonRichText } from "../utils/renderRichText";
import Error from "./Error";
import Loading from "./Loading";
import "./Person.scss";

function Person() {
  // Read the person's `fullName` which is the parameter used to query for the person's details
  const { fullName } = useParams();

  // Query AEM for the Person's details, using the `fullName` as the filtering parameter
  const { person, error } = usePersonByName(fullName);

  // Handle error and loading conditions
  if (error) {
    return <Error errorMessage={error} />;
  } else if (!person) {
    return <Loading />;
  }

  // Render the person data
  return (
    <div
      className="person"
      data-aue-resource={`urn:aemconnection:${person._path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={person.fullName}
    >
      <img
        className="person__image"
        src={process.env.REACT_APP_HOST_URI + person.profilePicture._path}
        alt={person.fullName}
        data-aue-prop="profilePicture"
        data-aue-type="media"
        data-aue-label="Profile Picture"
      />
      <div className="person__occupations">
        {person.occupation.map((occupation, index) => {
          return (
            <span key={index} className="person__occupation">
              {occupation}
            </span>
          );
        })}
      </div>
      <div className="person__content">
        <h1
          className="person__full-name"
          data-aue-prop="fullName"
          data-aue-type="text"
          data-aue-label="Full Name"
        >
          {person.fullName}
        </h1>
        <div
          className="person__biography"
          data-aue-prop="biographyText"
          data-aue-type="richtext"
          data-aue-label="Biography"
        >
          {mapJsonRichText(person.biographyText.json)}
        </div>
      </div>
    </div>
  );
}

export default Person;
