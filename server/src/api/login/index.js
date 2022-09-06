import { Router } from "express";
import { verifyJWT, createJWT } from "../../services/jwt";
import User from "../register/model";
import bcrypt from "bcrypt";
import { checkIfUserLoggedIn } from "../../services/middlewares/checkUserAuth";

const router = Router();

router.get("/", [checkIfUserLoggedIn], async (req, res, next) => {
  // res.render("/login");
  res.status(200).json({
    message: "User logged in",
  });
});

router.post("/", async (req, res, next) => {
  try {
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
