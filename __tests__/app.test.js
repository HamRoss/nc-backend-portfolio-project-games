const {
  categoryData,
  reviewData,
  userData,
  commentData,
} = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const db = require("../db/connection.js");
const request = require("supertest");

beforeAll(() => {
  return seed({ categoryData, reviewData, userData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  test("200 GET returns an array of category objects, each containing a slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);

        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404 GET responds with not found when passed incorrect path", () => {
    return request(app)
      .get("/api/sausages")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Data not found");
      });
  });
  test("404 GET responds with not found when passed incorrect path", () => {
    return request(app)
      .get("/sausages")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Data not found");
      });
  });
});
