import * as githubService from "../services/githubService.js";
import * as userService from "../services/userService.js";

import { usernameSchema } from "../utils/validateUser.js";

export async function syncUser(req, res) {
  try {
    const { username } = req.params;

    const parsed = usernameSchema.safeParse(username);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid username",
        details: parsed.error.errors,
      });
    }

    const user = await githubService.fetchGitHubUser(username);
    await userService.saveUser(user);

    res.status(200).json({
      message: "User synced successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
}
