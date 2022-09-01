import { Router } from "express";
import { createJWT } from "../../services/jwt";
import User from "./model";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { username } = req.body;
    const userEntry = await User.findOne({ username: username });
    if (userEntry) {
      res.status(409).json({
        message: "User already exists!",
      });
    } else {
      const user = new User(req.body);
      await user.save();
      const token = createJWT(user.username, "23h");
      const header = { "Access-Control-Expose-Headers": "jwt", jwt: token };
      res.set(header);
      res.status(201).json({
        username: user.username,
        password: user.password,
      });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
