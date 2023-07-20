const accessToken = "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";

const branchQuery = `
  query($owner:String!, $name:String!, $branchCursor: String!) {
    repository(owner: $owner, name: $name) {
      refs(first: 100, refPrefix: "refs/heads/",after: $branchCursor) {
        totalCount
        edges {
          node {
            name
            target {
              ...on Commit {
                history(first:0){
                  totalCount
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const commitFragment = `
  fragment CommitFragment on CommitHistoryConnection {
    totalCount
    nodes {
      oid
      message
      committedDate
      author {
        name
        email
        user {
          avatarUrl
          location
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`;

function buildCommitQuery(branches) {
  let query = `
        query ($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {`;
  for (const key in branches) {
    if (branches.hasOwnProperty(key) && branches[key].hasNextPage) {
      query += `
            ${key}: ref(qualifiedName: "${branches[key].name}") {
              target {
                ... on Commit {
                  history(first: 100, after: ${
                    branches[key].cursor
                      ? '"' + branches[key].cursor + '"'
                      : null
                  }) {
                    ...CommitFragment
                  }
                }
              }
            }`;
    }
  }
  query += `
          }
        }`;
  query += commitFragment;
  return query;
}

function doRequest(query, variables) {
  var payload = {
    query: query,
    variables: variables,
  };

  var payloadString = JSON.stringify(payload);

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": payloadString.length,
          Authorization: "bearer " + accessToken,
          "User-Agent": "GitHub GraphQL Client",
        },
        body: payloadString,
      });
      const data = await response.json();
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

function buildBranchObject(branch) {
  const refs = {};

  for (let i = 0; i < branch.length; i++) {
    refs["branch" + i] = {
      name: branch[i].node.name,
      totalCount: branch[i].node.target.history.totalCount,
      cursor: null,
      hasNextPage: true,
      commits: [],
    };
  }

  return refs;
}

export const requestGraphql = async (owner, repo) => {
  let iterateBranch = true;
  let branches = [];
  let userList = [];
  let cursor = "";

  while (iterateBranch) {
    let res = await doRequest(branchQuery, {
      owner: owner,
      name: repo,
      branchCursor: cursor,
    });
    iterateBranch = res.data.repository.refs.pageInfo.hasNextPage;
    cursor = res.data.repository.refs.pageInfo.endCursor;
    branches = branches.concat(res.data.repository.refs.edges);
  }

  let refChunk = [],
    size = 19;

  while (branches.length > 0) {
    refChunk.push(branches.splice(0, size));
  }

  for (let j = 0; j < refChunk.length; j++) {
    let refs = buildBranchObject(refChunk[j]);

    let hasNextPage = true;

    while (hasNextPage) {
      let commitQuery = buildCommitQuery(refs);

      let commitResult = await doRequest(commitQuery, {
        owner: owner,
        name: repo,
      });

      hasNextPage = false;

      for (const key in refs) {
        if (refs.hasOwnProperty(key) && commitResult.data.repository[key]) {
          let history = commitResult.data.repository[key].target.history;
          refs[key].commits = refs[key].commits.concat(history.nodes);
          refs[key].cursor = history.pageInfo.hasNextPage
            ? history.pageInfo.endCursor
            : "";
          refs[key].hasNextPage = history.pageInfo.hasNextPage;

          let nodes = history.nodes;

          nodes.forEach((node) => {
            const { author, committedDate } = node;
            const { email, name, user } = author;

            if (!userList[name]) {
              userList[name] = {
                name,
                email,
                location: user ? user.location : null,
                username: user ? user.name : null,
                avatarUrl: user ? user.avatarUrl : null,
                committedDate: committedDate,
              };
            } else {
              if (committedDate > userList[name].committedDate) {
                userList[name].committedDate = committedDate;
              }
            }
          });

          if (history.pageInfo.hasNextPage) {
            hasNextPage = true;
          }
        }
      }
    }
  }

  return userList;
};
