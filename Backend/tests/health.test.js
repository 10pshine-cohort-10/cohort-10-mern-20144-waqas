import { expect } from "chai";
import request from "supertest";
import app from "../index.js";

describe("Backend setup smoke test", () => {
  it("GET /api/test should return 200 and success true", async () => {
    const res = await request(app).get("/api/test");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      success: true,
      message: "Backend API is working successfully!",
    });
  });
});

