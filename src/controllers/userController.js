const githubService = require("../services/githubService");
const userService = require("../services/userService");

async function syncUser(req, res) {
  try {
    const { username } = req.params;

    const user = await githubService.fetchGitHubUser(username);

    await userService.saveUser(user);

    res.json({
      message: "User synced successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to sync user",
      details: err.message,
    });
  }
}

module.exports = { syncUser };
