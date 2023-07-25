import { Octokit } from "@octokit/rest";

const RESTRICT_EMAILS = ["users.noreply.github.com"];
const RESTRICT_LOCATIONS = ["korea", "seoul", "china"];

const accessToken = "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";

const nodeQuery = `
  query($ids:[ID!]!) {
    nodes(ids: $ids) {
      ... on User {
        name
        login
        location
        avatarUrl
        email
      }
    }
  }
`;

const octokit = new Octokit({});

export const requestGraphql = async (url) => {
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  let pagesRemaining = true;
  let data = [];

  while (pagesRemaining) {
    const response = await octokit.request(`GET ${url}`, {
      per_page: 100,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const users = parseData(response.data);

    const linkHeader = response.headers.link;

    pagesRemaining = linkHeader && linkHeader.includes(`rel="next"`);

    const userIDs = users
      .filter((user) => user.type !== "Bot")
      .map((user) => user.node_id);

    const payload = {
      query: nodeQuery,
      variables: {
        ids: userIDs,
      },
    };

    const payloadString = JSON.stringify(payload);

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": payloadString.length,
        Authorization: "bearer " + accessToken,
        "User-Agent": "GitHub GraphQL Client",
      },
      body: payloadString,
    });
    const temp = await res.json();

    data = [
      ...data,
      ...temp.data.nodes.filter(
        (item) =>
          item.email &&
          item.login &&
          item.email &&
          RESTRICT_EMAILS.every((email) => !item.email.includes(email)) &&
          RESTRICT_LOCATIONS.every(
            (location) =>
              item.location &&
              !item.location.trim().toLowerCase().includes(location)
          )
      ),
    ];

    if (pagesRemaining) {
      url = linkHeader.match(nextPattern)[0];
    }
  }

  return data;
};

function parseData(data) {
  // If the data is an array, return that
  if (Array.isArray(data)) {
    return data;
  }

  // Some endpoints respond with 204 No Content instead of empty array
  //   when there is no data. In that case, return an empty array.
  if (!data) {
    return [];
  }

  // Otherwise, the array of items that we want is in an object
  // Delete keys that don't include the array of items
  delete data.incomplete_results;
  delete data.repository_selection;
  delete data.total_count;
  // Pull out the array of items
  const namespaceKey = Object.keys(data)[0];
  data = data[namespaceKey];

  return data;
}
