import * as githubService from "../services/githubService.js";
import * as userService from "../services/userService.js";

import { calculateInsights } from "../services/insightService.js";
import { usernameSchema } from "../utils/validateUser.js";

export async function syncUser(req, res) {
  try {
    const { username } = req.params;

    // Validate username
    const parsed = usernameSchema.safeParse(username);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub username",
        errors: parsed.error.issues,
      });
    }

    // Fetch GitHub profile
    const user = await githubService.fetchGitHubUser(username);

    // Fetch repositories
    const repos = await githubService.fetchUserRepos(username);

    // Calculate custom insights
    const insights = calculateInsights(repos);

    // Save to database
    await userService.saveUser(user, insights);

    return res.status(200).json({
      success: true,
      message: "User synced successfully",
      data: {
        profile: {
          id: user.id,
          login: user.login,
          name: user.name,
          company: user.company,
          blog: user.blog,
          location: user.location,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        insights,
      },
    });
  } catch (err) {
    console.error("Sync User Error:", err);

    // GitHub user not found
    if (err.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "GitHub user not found",
      });
    }

    // GitHub rate limit
    if (err.response?.status === 403) {
      return res.status(429).json({
        success: false,
        message: "GitHub API rate limit exceeded",
      });
    }

    // GitHub unavailable
    if (err.response?.status >= 500) {
      return res.status(502).json({
        success: false,
        message: "GitHub service unavailable",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllUsers(req, res) {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
}

export async function getLocalUser(req, res) {
  const { username } = req.params;

  const user = await userService.getLocalUser(username);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found in local database",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
}