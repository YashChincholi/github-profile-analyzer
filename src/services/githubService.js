import axios from "axios";
import axiosRetry from "axios-retry";

const client = axios.create({
  timeout: 8000,
});

axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export async function fetchGitHubUser(username) {
  const response = await client.get(
    `https://api.github.com/users/${username}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "github-profile-analyzer",
      },
    },
  );

  return response.data;
}
