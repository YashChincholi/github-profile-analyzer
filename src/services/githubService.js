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
  try {
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
  } catch (error) {
    // Retain the original error structure so the controller's catch block can inspect error.response.status
    throw error;
  }
}

// FIX: Added the missing function expected by userController.js
export async function fetchUserRepos(username) {
  try {
    const response = await client.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "User-Agent": "github-profile-analyzer",
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
