import request from "supertest";
import app from "../src/app.js";

describe("GET /api/users/sync/:username", () => {
  it("should sync GitHub user", async () => {
    const res = await request(app).get("/api/users/sync/octocat");

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("login");
  });
});
