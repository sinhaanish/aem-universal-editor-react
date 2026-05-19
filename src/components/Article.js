/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import { useParams } from "react-router-dom";
import { useArticleBySlug } from "../api/usePersistedQueries";
import { mapJsonRichText } from "../utils/renderRichText";
import Error from "./Error";
import Loading from "./Loading";
import "./Article.scss";

function Article() {
  const { slug } = useParams();
  const { article, errors } = useArticleBySlug(slug);

  if (errors) {
    return <Error errorMessage={errors} />;
  } else if (!article) {
    return <Loading />;
  }

  const imageSrc = article.featuredImage?._dynamicUrl
    ? process.env.REACT_APP_HOST_URI + article.featuredImage._dynamicUrl + "?width=1400&preferwebp=true"
    : article.featuredImage?._path
    ? process.env.REACT_APP_HOST_URI + article.featuredImage._path
    : null;

  const authorName = article.authorFragment
    ? `${article.authorFragment.firstName ?? ""} ${article.authorFragment.lastName ?? ""}`.trim()
    : null;

  const authorAvatarSrc = article.authorFragment?.profilePicture?._dynamicUrl
    ? process.env.REACT_APP_HOST_URI + article.authorFragment.profilePicture._dynamicUrl + "?width=160&preferwebp=true"
    : article.authorFragment?.profilePicture?._path
    ? process.env.REACT_APP_HOST_URI + article.authorFragment.profilePicture._path
    : null;

  return (
    <div
      className="article"
      data-aue-resource={`urn:aemconnection:${article._path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={article.title}
    >
      {imageSrc && (
        <div className="article__hero">
          <img
            className="article__hero-img"
            src={imageSrc}
            alt={article.title}
            data-aue-prop="featuredImage"
            data-aue-type="media"
            data-aue-label="Featured Image"
          />
        </div>
      )}

      <div className="article__content">
        <h1
          className="article__title"
          data-aue-prop="title"
          data-aue-type="text"
          data-aue-label="Title"
        >
          {article.title}
        </h1>

        {authorName && (
          <div className="article__byline">
            {authorAvatarSrc && (
              <img
                className="article__author-avatar"
                src={authorAvatarSrc}
                alt={authorName}
              />
            )}
            <span className="article__author-name">By {authorName}</span>
          </div>
        )}

        {article.main?.json && (
          <div
            className="article__body"
            data-aue-prop="main"
            data-aue-type="richtext"
            data-aue-label="Main Content"
          >
            {mapJsonRichText(article.main.json)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Article;
