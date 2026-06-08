import db from "../db/connection.js";

function toMySQLDate(isoString) {
  if (!isoString) return null;

  return new Date(isoString).toISOString().slice(0, 19).replace("T", " ");
}

export async function saveUser(user, insights) {
  const sql = `
  INSERT INTO github_users (
      github_id,
      login,
      name,
      company,
      blog,
      location,
      public_repos,
      followers,
      following,
      total_stars,
      total_forks,
      top_language,
      created_at,
      updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

  ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      company = VALUES(company),
      blog = VALUES(blog),
      location = VALUES(location),
      public_repos = VALUES(public_repos),
      followers = VALUES(followers),
      following = VALUES(following),
      total_stars = VALUES(total_stars),
      total_forks = VALUES(total_forks),
      top_language = VALUES(top_language),
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
    insights.totalStars,
    insights.totalForks,
    insights.topLanguage,
    toMySQLDate(user.created_at),
    toMySQLDate(user.updated_at),
  ];

  await db.execute(sql, values);
}

export async function getAllUsers() {
  const [rows] = await db.execute(
    `SELECT * FROM github_users
     ORDER BY synced_at DESC`,
  );

  return rows;
}
export async function getLocalUser(username) {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM github_users
      WHERE login = ?
    `,
    [username],
  );

  return rows[0];
}