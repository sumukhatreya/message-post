import request from "supertest";
import { connect, clearDb, disconnect } from "../../services/test/db-handler";
import User from "../register/model";
import express from "../../services/express";
import api from "../../api";
import { apiRoot } from "../../config";

const app = express(apiRoot, api);
let mongoMemServerInst = null;
let token = null;

beforeAll(async () => {
  try {
    mongoMemServerInst = await connect("postsDb");
    const user = new User({
      username: "amt",
      password: "random1",
      firstName: "Alan",
      lastName: "Turing",
      email: "amt@mail.com",
    });
    await user.save();
    const res = await request(app).post("/login").send({
      username: "amt",
      password: "random1",
    });
    token = res.get("jwt");
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
    await clearDb(mongoMemServerInst);
    await disconnect(mongoMemServerInst);
  } catch (err) {
    console.log(err);
  }
});

describe("POST /posts", () => {
  describe("sending a valid post with a valid jwt", () => {
    test("should return a 201 response", async () => {
      console.log("JWT", token);
      const res = await request(app)
        .post("/posts")
        .send({
          title: "Hello",
          message: "lorem ipsum",
        })
        .set("jwt", token)
        .set("Content-Type", "application/json");

      expect(res.status).toBe(201);
    });

    test("should return a json object with the post details", async () => {
      const res = await request(app)
        .post("/posts")
        .send({
          title: "Hello",
          message: "lorem ipsum",
        })
        .set("jwt", token)
        .set("Content-Type", "application/json");

      // console.log(res);
      expect(res.body.title).toEqual("Hello");
    });
  });

  describe("sending an invalid jwt", () => {
    test("should return a 401 response code", async () => {
      const res = await request(app)
        .post("/posts")
        .send({
          title: "Hello",
          message: "lorem ipsum",
        })
        .set("jwt", null)
        .set("Content-Type", "application/json");

      expect(res.status).toEqual(401);
    });
  });
});

describe("GET /posts", () => {
  describe("sending a request with a valid jwt", () => {
    test("should return a 200 response", async () => {
      const res = await request(app).get("/posts").set("jwt", token);
      expect(res.status).toEqual(200);
    });

    test("should return an array of posts", async () => {
      const res = await request(app).get("/posts").set("jwt", token);
      expect(res.body.posts).toBeInstanceOf(Array);
    });
  });
});
