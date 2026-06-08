const db = require("../db/connection");

function toMySQLDate(isoString) {
  if (!isoString) return null;

  return new Date(isoString).toISOString().slice(0, 19).replace("T", " ");
}

async function saveUser(user) {
  const sql = `
    INSERT INTO github_users 
    (id, login, name, company, blog, location, public_repos, followers, following, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      followers = VALUES(followers),
      following = VALUES(following),
      updated_at = VALUES(updated_at)
  `;

  const values = [
    user.id,
    user.login,
    user.name,
    user.company,
    user.blog,
    user.location,
    user.public_repos,
    user.followers,
    user.following,
    toMySQLDate(user.created_at),
    toMySQLDate(user.updated_at),
  ];

  await db.execute(sql, values);
}

module.exports = { saveUser };
