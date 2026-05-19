/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import { Link } from "react-router-dom";
import { useAllAdventures } from "../api/usePersistedQueries";
import Error from "./Error";
import Loading from "./Loading";
import "./Adventures.scss";

function Adventures() {
  const { adventures, error } = useAllAdventures();

  if (error) {
    return <Error errorMessage={error} />;
  } else if (!adventures) {
    return <Loading />;
  }

  return (
    <div className="adventures">
      {adventures.map((adventure, index) => (
        <AdventureCard key={index} {...adventure} />
      ))}
    </div>
  );
}

function AdventureCard({ _path, slug, title, activity, price, tripLength, primaryImage }) {
  if (!title || !slug) {
    return null;
  }

  const imageSrc = primaryImage?._dynamicUrl
    ? process.env.REACT_APP_HOST_URI + primaryImage._dynamicUrl + "?width=800&preferwebp=true"
    : primaryImage?._path
    ? process.env.REACT_APP_HOST_URI + primaryImage._path
    : null;

  return (
    <div
      className="adventure-card"
      data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={title}
    >
      {imageSrc && (
        <div className="adventure-card__image-wrap">
          <img
            className="adventure-card__image"
            src={imageSrc}
            alt={title}
            data-aue-prop="primaryImage"
            data-aue-type="media"
            data-aue-label="Primary Image"
          />
        </div>
      )}

      <div className="adventure-card__body">
        {activity && (
          <span
            className="adventure-card__activity"
            data-aue-prop="activity"
            data-aue-type="text"
            data-aue-label="Activity"
          >
            {activity}
          </span>
        )}

        <h2
          className="adventure-card__title"
          data-aue-prop="title"
          data-aue-type="text"
          data-aue-label="Title"
        >
          {title}
        </h2>

        <div className="adventure-card__meta">
          {tripLength && (
            <span
              className="adventure-card__trip-length"
              data-aue-prop="tripLength"
              data-aue-type="text"
              data-aue-label="Trip Length"
            >
              {tripLength}
            </span>
          )}
          {price != null && (
            <span
              className="adventure-card__price"
              data-aue-prop="price"
              data-aue-type="number"
              data-aue-label="Price"
            >
              ${price.toLocaleString()}
            </span>
          )}
        </div>

        <Link className="adventure-card__cta" to={`/adventure/${slug}`}>
          Explore
        </Link>
      </div>
    </div>
  );
}

export default Adventures;
