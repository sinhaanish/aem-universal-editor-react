/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import aemHeadlessClient from "./aemHeadlessClient";
import { useEffect, useState } from "react";

const ACTION_URL = process.env.REACT_APP_ACTION_URL;

async function fetchPersistedQuery(persistedQueryName, queryParameters) {
  let data;
  let err;

  // In production (App Builder), use the server-side proxy action so credentials
  // never reach the browser. In local dev, call AEM directly via the headless client.
  if (ACTION_URL) {
    try {
      const params = new URLSearchParams({ queryName: persistedQueryName });
      if (queryParameters) {
        Object.entries(queryParameters).forEach(([k, v]) =>
          params.append(`var_${k}`, v)
        );
      }
      const res = await fetch(`${ACTION_URL}?${params}`);
      const json = await res.json();
      data = json?.data;
      if (!res.ok) err = json?.error || `HTTP ${res.status}`;
    } catch (e) {
      err = e.message;
    }
  } else {
    try {
      const response = await aemHeadlessClient.runPersistedQuery(
        persistedQueryName,
        queryParameters
      );
      data = response?.data;
    } catch (e) {
      err = e
        .toJSON()
        ?.map((error) => error.message)
        ?.join(", ");
      console.error(e.toJSON());
    }
  }

  return { data, err };
}

/**
 * Fetches all adventures.
 * Calls the persisted query: wknd-shared/adventures-all
 */
export function useAllAdventures() {
  const [adventures, setAdventures] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, err } = await fetchPersistedQuery(
        "wknd-shared/adventures-all"
      );
      setAdventures(data?.adventureList?.items);
      setError(err);
    }
    fetchData();
  }, []);

  return { adventures, error };
}

/**
 * Fetches a single adventure by slug.
 * Calls the persisted query: wknd-shared/adventure-by-slug
 */
export function useAdventureBySlug(slug) {
  const [adventure, setAdventure] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const queryParameters = { slug };

      const { data, err } = await fetchPersistedQuery(
        "wknd-shared/adventure-by-slug",
        queryParameters
      );

      if (err) {
        setErrors(err);
      } else if (data?.adventureList?.items?.length === 1) {
        setAdventure(data.adventureList.items[0]);
      } else {
        setErrors(`Cannot find adventure with slug: ${slug}`);
      }
    }
    fetchData();
  }, [slug]);

  return { adventure, errors };
}

/**
 * Fetches all articles (paginated endpoint, flattened to items array).
 * Calls the persisted query: wknd-shared/articles-all
 */
export function useAllArticles() {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, err } = await fetchPersistedQuery(
        "wknd-shared/articles-all"
      );
      // articles-all uses a paginated (edges/node) response shape
      const items = data?.articlePaginated?.edges?.map((e) => e.node) ?? null;
      setArticles(items);
      setError(err);
    }
    fetchData();
  }, []);

  return { articles, error };
}

/**
 * Fetches a single article by slug.
 * Calls the persisted query: wknd-shared/article-by-slug
 */
export function useArticleBySlug(slug) {
  const [article, setArticle] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const queryParameters = { slug };

      const { data, err } = await fetchPersistedQuery(
        "wknd-shared/article-by-slug",
        queryParameters
      );

      if (err) {
        setErrors(err);
      } else if (data?.articleList?.items?.length === 1) {
        setArticle(data.articleList.items[0]);
      } else {
        setErrors(`Cannot find article with slug: ${slug}`);
      }
    }
    fetchData();
  }, [slug]);

  return { article, errors };
}
