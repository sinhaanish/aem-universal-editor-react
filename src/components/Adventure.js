/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import { useParams } from "react-router-dom";
import { useAdventureBySlug } from "../api/usePersistedQueries";
import { mapJsonRichText } from "../utils/renderRichText";
import Error from "./Error";
import Loading from "./Loading";
import "./Adventure.scss";

function Adventure() {
  const { slug } = useParams();
  const { adventure, errors } = useAdventureBySlug(slug);

  if (errors) {
    return <Error errorMessage={errors} />;
  } else if (!adventure) {
    return <Loading />;
  }

  const imageSrc = adventure.primaryImage?._dynamicUrl
    ? process.env.REACT_APP_HOST_URI + adventure.primaryImage._dynamicUrl + "?width=1400&preferwebp=true"
    : adventure.primaryImage?._path
    ? process.env.REACT_APP_HOST_URI + adventure.primaryImage._path
    : null;

  return (
    <div
      className="adventure"
      data-aue-resource={`urn:aemconnection:${adventure._path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={adventure.title}
    >
      {imageSrc && (
        <div className="adventure__hero">
          <img
            className="adventure__hero-image"
            src={imageSrc}
            alt={adventure.title}
            data-aue-prop="primaryImage"
            data-aue-type="media"
            data-aue-label="Primary Image"
          />
          <div className="adventure__hero-overlay">
            {adventure.activity && (
              <span
                className="adventure__activity"
                data-aue-prop="activity"
                data-aue-type="text"
                data-aue-label="Activity"
              >
                {adventure.activity}
              </span>
            )}
            <h1
              className="adventure__title"
              data-aue-prop="title"
              data-aue-type="text"
              data-aue-label="Title"
            >
              {adventure.title}
            </h1>
          </div>
        </div>
      )}

      {!imageSrc && (
        <h1
          className="adventure__title adventure__title--no-hero"
          data-aue-prop="title"
          data-aue-type="text"
          data-aue-label="Title"
        >
          {adventure.title}
        </h1>
      )}

      <div className="adventure__content">
        <div className="adventure__stats">
          {adventure.tripLength && (
            <div className="adventure__stat">
              <span className="adventure__stat-label">Duration</span>
              <span
                className="adventure__stat-value"
                data-aue-prop="tripLength"
                data-aue-type="text"
                data-aue-label="Trip Length"
              >
                {adventure.tripLength}
              </span>
            </div>
          )}
          {adventure.groupSize && (
            <div className="adventure__stat">
              <span className="adventure__stat-label">Group Size</span>
              <span
                className="adventure__stat-value"
                data-aue-prop="groupSize"
                data-aue-type="number"
                data-aue-label="Group Size"
              >
                {adventure.groupSize}
              </span>
            </div>
          )}
          {adventure.difficulty && (
            <div className="adventure__stat">
              <span className="adventure__stat-label">Difficulty</span>
              <span
                className="adventure__stat-value"
                data-aue-prop="difficulty"
                data-aue-type="text"
                data-aue-label="Difficulty"
              >
                {adventure.difficulty}
              </span>
            </div>
          )}
          {adventure.price != null && (
            <div className="adventure__stat">
              <span className="adventure__stat-label">Price</span>
              <span
                className="adventure__stat-value adventure__stat-value--price"
                data-aue-prop="price"
                data-aue-type="number"
                data-aue-label="Price"
              >
                ${adventure.price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {adventure.description?.json && (
          <div
            className="adventure__description"
            data-aue-prop="description"
            data-aue-type="richtext"
            data-aue-label="Description"
          >
            {mapJsonRichText(adventure.description.json)}
          </div>
        )}

        {adventure.itinerary?.json && (
          <div className="adventure__section">
            <h2 className="adventure__section-title">Itinerary</h2>
            <div
              className="adventure__itinerary"
              data-aue-prop="itinerary"
              data-aue-type="richtext"
              data-aue-label="Itinerary"
            >
              {mapJsonRichText(adventure.itinerary.json)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Adventure;
