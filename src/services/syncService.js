import * as githubService from "./githubService.js";
import * as userService from "./userService.js";

import { calculateInsights } from "./insightService.js";
import AppError from "../utils/AppError.js";
import { handleGitHubError } from "../utils/githubErrorHandler.js";

export async function syncGitHubUser(username) {
  try {
    const user = await githubService.fetchGitHubUser(username);

    const existingUser = await userService.getStoredUser(username);

    if (
      existingUser &&
      new Date(existingUser.updated_at).toISOString() === user.updated_at
    ) {
      return {
        status: "UNCHANGED",
        message: "GitHub profile unchanged",
      };
    }

    const repos = await githubService.fetchUserRepos(username);

    const insights = calculateInsights(repos);

    await userService.saveUser(user, insights);

    return {
      status: "UPDATED",
      message: "User synced successfully",
      data: {
        profile: user,
        insights,
      },
    };
  } catch (error) {
    handleGitHubError(error);
  }
}
