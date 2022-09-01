import { Router } from "express";
import { verifyJWT, createJWT } from "../../services/jwt";
import User from "../register/model";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("JWT header", req.get("jwt"));
    const token = req.get("jwt");
    if (token && verifyJWT(token)) {
      res.status(200).json({
        message: "User already logged in",
      });
    } else {
      res.status(401).json({
        message: "User not logged in",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log("In the login post endpoint");
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    console.log("Before bcrypt compare", password, user.password);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = createJWT(username, "23h");
      const header = { "Access-Control-Expose-Headers": "jwt", jwt: token };
      res.set(header);
      res.status(200).json({
        username: username,
      });
    } else {
      res.status(401).json({
        message: "Login unsuccessful",
      });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
