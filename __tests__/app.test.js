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
const { checkDescendingOrder } = require("../db/seeds/utils");

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
});

describe("invalid path errors", () => {
  test("404 GET responds with not found when passed incorrect path after /api/", () => {
    return request(app)
      .get("/api/sausages")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Data not found");
      });
  });
  test("404 GET responds with not found when passed incorrect path without /api/", () => {
    return request(app)
      .get("/sausages")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Data not found");
      });
  });
});

describe("api/reviews/:review_id", () => {
  test("200 GET responds with a single review object with all required properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
        });
      });
  });
  test("404 GET returns not found message when review id is valid but does not exist", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("No review found for review_id 999");
      });
  });
  test("400 GET returns bad request message when review id is not an integer", () => {
    return request(app)
      .get("/api/reviews/sausage")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("/api/reviews", () => {
  test("200 GET responds with array of review objects, including comment count", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);

        reviews.forEach((review) => {
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            owner: expect.any(String),
            title: expect.any(String),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200 GET review objects should be sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(
          checkDescendingOrder(reviews.map((review) => review.created_at))
        ).toBe(true);
      });
  });
});

describe("/api/reviews/:review_id/comments REPEATED", () => {
  test("201 POST responds with posted comment", () => {
    const newComment = { username: "mallionaire", body: "Wow. Such fun" };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Wow. Such fun",
          review_id: expect.any(Number),
          author: "mallionaire",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400 POST will return bad request message if input body is missing required fields", () => {
    const newComment = { body: "This body is missing a username" };
    return request(app)
      .post("/api/reviews/7/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Missing required field(s)");
      });
  });
  test("400 POST will return bad request if input body has all required fields, but user does not exist", () => {
    const newComment = {
      username: "RossHamilton",
      body: "This user does not exist",
    };
    return request(app)
      .post("/api/reviews/7/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
  test("201 POST will ignore unnecessary properties", () => {
    const newComment = {
      username: "mallionaire",
      body: "Amaze. Such game",
      unecessary_property: "This should be ignored",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Amaze. Such game",
          review_id: expect.any(Number),
          author: "mallionaire",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400 POST will return bad request error message if id is invalid", () => {
    const newComment = {
      username: "mallionaire",
      body: "Such doge. Wow",
    };
    return request(app)
      .post("/api/reviews/sausage/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("404 POST will return not found error message if review id is valid but does not exist", () => {
    const newComment = {
      username: "mallionaire",
      body: "Wuuuuuuuuuuew. Mighty fine game you got here",
    };
    return request(app)
      .post("/api/reviews/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
});
