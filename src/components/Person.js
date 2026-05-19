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
  const { fullName } = useParams();
  const { person, errors } = usePersonByName(fullName);

  if (errors) {
    return <Error errorMessage={errors} />;
  } else if (!person) {
    return <Loading />;
  }

  const profilePictureSrc = person.profilePicture?._path
    ? process.env.REACT_APP_HOST_URI + person.profilePicture._path
    : null;

  return (
    // Universal Editor: marks this element as an editable Content Fragment reference
    <div
      className="person"
      data-aue-resource={`urn:aemconnection:${person._path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={person.fullName}
    >
      {profilePictureSrc && (
        // Universal Editor: inline-editable media field mapped to 'profilePicture'
        <img
          className="person__image"
          src={profilePictureSrc}
          alt={person.fullName}
          data-aue-prop="profilePicture"
          data-aue-type="media"
          data-aue-label="Profile Picture"
        />
      )}

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
        {/* Universal Editor: inline-editable text field mapped to 'fullName' */}
        <h1
          className="person__full-name"
          data-aue-prop="fullName"
          data-aue-type="text"
          data-aue-label="Full Name"
        >
          {person.fullName}
        </h1>

        {/* Universal Editor: rich text field mapped to 'biographyText' */}
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
