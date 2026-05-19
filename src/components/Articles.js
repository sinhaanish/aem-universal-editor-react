/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import { Link } from "react-router-dom";
import { useAllArticles } from "../api/usePersistedQueries";
import Error from "./Error";
import Loading from "./Loading";
import "./Articles.scss";

function Articles() {
  const { articles, error } = useAllArticles();

  if (error) {
    return <Error errorMessage={error} />;
  } else if (!articles) {
    return <Loading />;
  }

  return (
    <div className="articles-page">
      <div className="articles-page__header">
        <h2 className="articles-page__title">WKND Magazine</h2>
        <p className="articles-page__sub">
          Stories, guides, and inspiration from the world's most breathtaking destinations.
        </p>
      </div>

      <div className="articles-grid">
        {articles.map((article, index) => (
          <ArticleCard key={index} {...article} featured={index === 0} />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ _path, slug, title, featuredImage, authorFragment, featured }) {
  if (!title || !slug) return null;

  const imageSrc = featuredImage?._dynamicUrl
    ? process.env.REACT_APP_HOST_URI + featuredImage._dynamicUrl + "?width=1200&preferwebp=true"
    : featuredImage?._path
    ? process.env.REACT_APP_HOST_URI + featuredImage._path
    : null;

  const authorName = authorFragment
    ? `${authorFragment.firstName ?? ""} ${authorFragment.lastName ?? ""}`.trim()
    : null;

  return (
    <article
      className={`article-card${featured ? " article-card--featured" : ""}`}
      data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={title}
    >
      {imageSrc && (
        <Link to={`/article/${slug}`} className="article-card__img-wrap">
          <img
            className="article-card__img"
            src={imageSrc}
            alt={title}
            data-aue-prop="featuredImage"
            data-aue-type="media"
            data-aue-label="Featured Image"
          />
        </Link>
      )}

      <div className="article-card__body">
        <Link to={`/article/${slug}`} className="article-card__title-link">
          <h2
            className="article-card__title"
            data-aue-prop="title"
            data-aue-type="text"
            data-aue-label="Title"
          >
            {title}
          </h2>
        </Link>

        {authorName && (
          <div className="article-card__author">
            {authorFragment?.profilePicture?._path && (
              <img
                className="article-card__author-avatar"
                src={process.env.REACT_APP_HOST_URI + authorFragment.profilePicture._path}
                alt={authorName}
              />
            )}
            <span className="article-card__author-name">By {authorName}</span>
          </div>
        )}

        <Link className="article-card__read-more" to={`/article/${slug}`}>
          Read Article →
        </Link>
      </div>
    </article>
  );
}

export default Articles;
