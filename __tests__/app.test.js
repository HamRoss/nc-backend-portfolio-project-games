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
  test("200 GET will respond with group of review objects where reviews is queried by category", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);

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
  test("200 GET will respond with all reviews if category query is included in url but value is omitted", () => {
    return request(app)
      .get("/api/reviews?category=")
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
  test("200 GET will sort all results by review_id in descending order if not specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        const mappedReviews = reviews.map((review) => {
          return review.review_id;
        });
        expect(mappedReviews).toBeSorted({ descending: true });
      });
  });
  test("200 GET will sort all results by votes in descending order if not specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        const mappedReviews = reviews.map((review) => {
          return review.votes;
        });
        expect(mappedReviews).toBeSorted({ descending: true });
      });
  });
  test("200 GET will sort all results by comment_count in descending order if not specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        const mappedReviews = reviews.map((review) => {
          return review.comment_count;
        });
        expect(mappedReviews).toBeSorted({ descending: true });
      });
  });
  test("200 GET will return specific categories, sorted by an additional variable if request includes categories and sort by queries", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);
        const mappedReviews = reviews.map((review) => {
          return review.votes;
        });
        expect(mappedReviews).toBeSorted({ descending: true });
      });
  });
  test("200 GET will return all results sorted by date in ascending order if sort_by is not defined but order is ascending", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        const mappedReviews = reviews.map((review) => {
          return review.created_at;
        });
        expect(mappedReviews).toBeSorted();
      });
  });
  test("200 GET will return all results sorted by another variable in ascending order if sort_by is defined and order is ascending", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        const mappedReviews = reviews.map((review) => {
          return review.votes;
        });
        expect(mappedReviews).toBeSorted();
      });
  });
  test("200 GET will return results matching a specific category, sorted by a variable, in ascending order, if category and sort_by are defined, and order is ascending", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction&sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);
        const mappedReviews = reviews.map((review) => {
          return review.votes;
        });
        expect(mappedReviews).toBeSorted();
      });
  });
  test("404 GET will return an error message if a category doesn't exist", () => {
    return request(app)
      .get("/api/reviews?category=sausages")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Category sausages not found");
      });
  });
  test("200 GET will return an empty array when category exists, but doesn't match any reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual([]);
      });
  });
  test("400 GET will return bad request message if sort_by value doesn't match a column", () => {
    return request(app)
      .get("/api/reviews?sort_by=sausages")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("You can't sort by sausages");
      });
  });
  test("400 GET allow requests that order by anything except asc, desc, ASC, or DESC", () => {
    return request(app)
      .get("/api/reviews?order=sausages")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("You can't order by sausages");
      });
  });
  //wont allow you to order by anything except asc or desc

  test("200 PATCH increment will respond with updated review, when valid request body increments existing review by the required number of positive votes", () => {
    const inputObject = {
      inc_votes: 20,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(inputObject)
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
          created_at: expect.any(String),
          votes: 21,
        });
      });
  });
  test("200 PATCH decrement will respond with updated review, when valid request body decrements existing review by the required number of negative votes", () => {
    const inputObject = {
      inc_votes: -21,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(inputObject)
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
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("400 PATCH responds with bad request message if input object doesn't include inc_votes", () => {
    const inputObject = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(inputObject)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Missing required field(s)");
      });
  });
  test("400 PATCH responds with bad request if input object has an invalid data type", () => {
    const inputObject = {
      inc_votes: "invalid data type",
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(inputObject)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid data type");
      });
  });
  test("200 PATCH will ignore unnecessary properties in the request body", () => {
    const inputObject = {
      inc_votes: 1,
      unnecessary_property: 100,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(inputObject)
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
          created_at: expect.any(String),
          votes: 1,
        });
      });
  });
  test("404 PATCH returns not found message if review_id doesn't exist", () => {
    const inputObject = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/reviews/100000")
      .send(inputObject)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Can't update votes. Review ID 100000 not found");
      });
  });
  test("400 PATCH returns bad request message if review_id is invalid", () => {
    const inputObject = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/reviews/invalidUrl")
      .send(inputObject)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid data type");
      });
  });
});

describe("api/reviews/:review_id", () => {
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
        expect(msg).toBe("Invalid data type");
      });
  });
  test("200 GET returns a review object with all required properties, including comment_count, when passed a valid review_id that exists and has one or more comments associated with it", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
          category: "social deduction",
          review_body: "We couldn't find the werewolf!",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          comment_count: 3,
        });
      });
  });
  test("200 GET returns a review object with all required properties and a comment_count of zero, when passed a valid review_id that exists, but has no comments associated with it", () => {
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
          comment_count: 0,
        });
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
        expect(msg).toBe("Invalid data type");
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
        expect(msg).toBe("Invalid data type");
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
describe("/api/comments/:comment_id", () => {
  test("204 DELETE should receive 204 status code", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404 DELETE should receive not found message if comment_id is valid but doesn't exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment ID 99999 not found");
      });
  });
  test("400 DELETE should receive bad request message if comment_id is not valid number", () => {
    return request(app)
      .delete("/api/comments/notANumber")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid data type");
      });
  });
});
describe("/api/users", () => {
  test("200 GET responds with array of user objects with correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404 GET responds with not found message if users is misspelled", () => {
    return request(app)
      .get("/api/uuusers")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Data not found");
      });
  });
});
