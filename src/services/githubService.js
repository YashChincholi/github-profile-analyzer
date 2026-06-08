const axios = require("axios");

async function fetchGitHubUser(username) {
  const response = await axios.get(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "node-app",
    },
  });

  return response.data;
}

module.exports = { fetchGitHubUser };
