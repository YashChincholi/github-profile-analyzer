import db from "../db/connection.js";

export async function healthCheck(req, res) {
  try {
    await db.execute("SELECT 1");

    res.status(200).json({
      success: true,
      uptime: process.uptime(),
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      success: false,
      database: "disconnected",
    });
  }
}
