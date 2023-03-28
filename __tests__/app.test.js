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
require("jest-sorted");
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
describe("/api/reviews/:review_id/comments", () => {
  test("200 GET responds with an array of review comments if the review_id exists and has associated comments", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });

  test("200 GET array of reviews should be in descending order by created_at", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        const mappedComments = comments.map((comment) => {
          return comment.created_at;
        });
        expect(mappedComments).toBeSorted({ descending: true });
      });
  });
  test("404 GET responds with not found if review_id is valid but does not exist", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("No review found for review_id 999");
      });
  });
  test("400 GET responds with bad request if review_id is not valid number", () => {
    return request(app)
      .get("/api/reviews/notNumber/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("200 GET responds with an empty array if review_id exists, but has no comments associated with it", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});
