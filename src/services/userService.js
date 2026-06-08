import db from "../db/connection.js";

/**
 * Utility to convert an ISO date string to a safe MySQL DATETIME string format.
 */
function toMySQLDate(isoString) {
  if (!isoString) return null;
  try {
    return new Date(isoString).toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.error("Date parsing utility error:", error);
    return null;
  }
}

/**
 * Inserts or updates a user profile using safeupsert upsert parameters.
 */
export async function saveUser(user, insights) {
  try {
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
  } catch (error) {
    console.error(`DB Error in saveUser for ${user?.login}:`, error);
    throw error;
  }
}

/**
 * Fetches all tracked users sorted by latest synchronization timestamp.
 */
export async function getAllUsers() {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM github_users ORDER BY synced_at DESC`,
    );
    return rows;
  } catch (error) {
    console.error("DB Error in getAllUsers:", error);
    throw error;
  }
}

/**
 * Fetches a complete local profile record.
 */
export async function getLocalUser(username) {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM github_users WHERE login = ?`,
      [username],
    );
    return rows[0];
  } catch (error) {
    console.error(`DB Error in getLocalUser for ${username}:`, error);
    throw error;
  }
}

/**
 * Optimized lookup payload to ascertain profile validation properties.
 */
export async function getStoredUser(username) {
  try {
    const [rows] = await db.execute(
      `SELECT login, updated_at FROM github_users WHERE login = ?`,
      [username],
    );
    return rows[0];
  } catch (error) {
    console.error(`DB Error in getStoredUser for ${username}:`, error);
    throw error;
  }
}

/**
 * Aggregates analytical parameters cross-referenced through active instances.
 * FIX: Added missing 'FROM github_users' target locator statement block.
 */
export async function getAnalyticsSummary() {
  try {
    const [rows] = await db.execute(`
      SELECT
        COUNT(*) AS total_users,
        ROUND(AVG(public_repos), 2) AS avg_repositories,
        SUM(total_stars + total_forks) AS ecosystem_impact,
        (
          SELECT login
          FROM github_users
          ORDER BY total_stars DESC
          LIMIT 1
        ) AS top_influencer
      FROM github_users
    `);
    return rows[0];
  } catch (error) {
    console.error("DB Error in getAnalyticsSummary:", error);
    throw error;
  }
}

/**
 * Pulls ranking profiles sequentially descending across star tracking tiers.
 * FIX: Swapped to db.query to prevent prepared-statement parameter injection type mismatches with LIMIT clauses.
 */
export async function getTopInfluencers(limit = 10) {
  try {
    const cleanLimit = parseInt(limit, 10) || 10;

    const [rows] = await db.query(
      `
      SELECT
        login,
        total_stars,
        followers
      FROM github_users
      ORDER BY total_stars DESC
      LIMIT ?
      `,
      [cleanLimit],
    );
    return rows;
  } catch (error) {
    console.error(`DB Error in getTopInfluencers with limit ${limit}:`, error);
    throw error;
  }
}

/**
 * Searches users filtering explicitly down into an absolute matching language attribute.
 */
export async function searchByLanguage(language) {
  try {
    const [rows] = await db.execute(
      `
      SELECT *
      FROM github_users
      WHERE top_language = ?
      ORDER BY total_stars DESC
      `,
      [language],
    );
    return rows;
  } catch (error) {
    console.error(`DB Error in searchByLanguage for ${language}:`, error);
    throw error;
  }
}
