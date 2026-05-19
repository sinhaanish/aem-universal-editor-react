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
import { useAllArticles } from "../api/usePersistedQueries";
import Loading from "./Loading";
import "./Home.scss";

function Home() {
  const { adventures } = useAllAdventures();
  const { articles } = useAllArticles();

  const featuredAdventures = adventures?.slice(0, 4) ?? [];
  const featuredArticles = articles?.slice(0, 3) ?? [];

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-content">
          <span className="home__hero-eyebrow">Explore the World</span>
          <h1 className="home__hero-headline">
            Adventure Awaits.<br />Are You Ready?
          </h1>
          <p className="home__hero-sub">
            Curated outdoor adventures and travel stories from the world's most
            extraordinary destinations.
          </p>
          <div className="home__hero-ctas">
            <Link className="home__cta home__cta--primary" to="/adventures">
              Browse Adventures
            </Link>
            <Link className="home__cta home__cta--secondary" to="/articles">
              Read Magazine
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Adventures */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">Featured Adventures</h2>
          <Link className="home__section-link" to="/adventures">
            View all →
          </Link>
        </div>

        {!adventures ? (
          <Loading />
        ) : (
          <div className="home__adventure-grid">
            {featuredAdventures.map((adv, i) => (
              <FeaturedAdventureCard key={i} {...adv} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Articles */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">From the Magazine</h2>
          <Link className="home__section-link" to="/articles">
            View all →
          </Link>
        </div>

        {!articles ? (
          <Loading />
        ) : (
          <div className="home__article-grid">
            {featuredArticles.map((art, i) => (
              <FeaturedArticleCard key={i} {...art} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedAdventureCard({ _path, slug, title, activity, tripLength, primaryImage }) {
  if (!title || !slug) return null;

  const imageSrc = primaryImage?._dynamicUrl
    ? process.env.REACT_APP_HOST_URI + primaryImage._dynamicUrl + "?width=800&preferwebp=true"
    : primaryImage?._path
    ? process.env.REACT_APP_HOST_URI + primaryImage._path
    : null;

  return (
    <Link
      className="home__adv-card"
      to={`/adventure/${slug}`}
      data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={title}
    >
      {imageSrc && (
        <img className="home__adv-card-img" src={imageSrc} alt={title} />
      )}
      <div className="home__adv-card-body">
        {activity && (
          <span className="home__adv-card-activity">{activity}</span>
        )}
        <h3 className="home__adv-card-title">{title}</h3>
        {tripLength && (
          <span className="home__adv-card-meta">{tripLength}</span>
        )}
      </div>
    </Link>
  );
}

function FeaturedArticleCard({ _path, slug, title, featuredImage, authorFragment }) {
  if (!title || !slug) return null;

  const imageSrc = featuredImage?._dynamicUrl
    ? process.env.REACT_APP_HOST_URI + featuredImage._dynamicUrl + "?width=800&preferwebp=true"
    : featuredImage?._path
    ? process.env.REACT_APP_HOST_URI + featuredImage._path
    : null;

  const authorName = authorFragment
    ? `${authorFragment.firstName ?? ""} ${authorFragment.lastName ?? ""}`.trim()
    : null;

  return (
    <Link
      className="home__art-card"
      to={`/article/${slug}`}
      data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={title}
    >
      {imageSrc && (
        <div className="home__art-card-img-wrap">
          <img className="home__art-card-img" src={imageSrc} alt={title} />
        </div>
      )}
      <div className="home__art-card-body">
        <h3 className="home__art-card-title">{title}</h3>
        {authorName && (
          <span className="home__art-card-author">By {authorName}</span>
        )}
      </div>
    </Link>
  );
}

export default Home;
