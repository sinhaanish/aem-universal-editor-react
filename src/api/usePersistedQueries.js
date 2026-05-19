/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import aemHeadlessClient from "./aemHeadlessClient";
import { useEffect, useState } from "react";

async function fetchPersistedQuery(persistedQueryName, queryParameters) {
  let data;
  let err;

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

  return { data, err };
}

/**
 * Fetches all teams with their member references.
 * Calls the persisted query: headless-content/all-teams
 */
export function useAllTeams() {
  const [teams, setTeams] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, err } = await fetchPersistedQuery(
        "my-project/all-teams"
      );
      setTeams(data?.teamList?.items);
      setError(err);
    }
    fetchData();
  }, []);

  return { teams, error };
}

/**
 * Fetches a single person by full name.
 * Calls the persisted query: headless-content/person-by-name
 */
export function usePersonByName(fullName) {
  const [person, setPerson] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const queryParameters = { name: fullName };

      const { data, err } = await fetchPersistedQuery(
        "my-project/person-by-name",
        queryParameters
      );

      if (err) {
        setErrors(err);
      } else if (data?.personList?.items?.length === 1) {
        setPerson(data.personList.items[0]);
      } else {
        setErrors(`Cannot find person with name: ${fullName}`);
      }
    }
    fetchData();
  }, [fullName]);

  return { person, errors };
}
