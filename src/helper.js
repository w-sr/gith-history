export const extractGitHubInfoFromURL = (url) => {
  const gitHubRegex = /github\.com\/([^/]+)\/([^/]+)(\.git)?$/;
  const match = url.match(gitHubRegex);

  if (match) {
    const username = match[1];
    const repoName = match[2];
    return { username, repoName };
  } else {
    return null;
  }
};
