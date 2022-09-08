import { connect, clearDb, disconnect } from "../../services/test/db-handler";
import User from "../register/model";
import request from "supertest";
import express from "../../services/express";
import api from "../../api";
import { apiRoot } from "../../config";

const app = express(apiRoot, api);

let mongoMemServerInst = null;

beforeAll(async () => {
  try {
    mongoMemServerInst = await connect("loginDb");
    const user = new User({
      username: "ssa",
      password: "random",
      firstName: "Sumukh",
      lastName: "Atreya",
      email: "ssa@mail.com",
    });
    await user.save();
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

describe("POST /login", () => {
  describe("sending a valid username and password", () => {
    test("should return a 200 status code and username in the response body", async () => {
      const res = await request(app).post("/login").send({
        username: "ssa",
        password: "random",
      });
      expect(res.status).toBe(200);
      expect(res.body.username).toBe("ssa");
    });

    test("should return a jwt in the response header", async () => {
      const res = await request(app).post("/login").send({
        username: "ssa",
        password: "random",
      });
      // console.log(res.get("jwt"));
      expect(res.get("jwt")).toBeTruthy();
    });

    test("should return a 401 response if given invalid credemtials", async () => {
      const res = await request(app).post("/login").send({
        username: "ssa",
        password: "blah",
      });
      expect(res.status).toBe(401);
    });
  });
});
