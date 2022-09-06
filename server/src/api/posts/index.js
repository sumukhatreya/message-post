import { Router } from "express";
import Post from "./model";
import { verifyJWT } from "../../services/jwt";
import User from "../register/model";
import { checkIfUserLoggedIn } from "../../services/middlewares/checkUserAuth";

const router = Router();

router.get("/", [checkIfUserLoggedIn], async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      posts,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", [checkIfUserLoggedIn], async (req, res, next) => {
  try {
    const token = req.get("jwt");
    const { title, message } = req.body;
    const { username, valid } = verifyJWT(token);
    const user = await User.findOne({ username: username }, { _id: 1 });
    const post = new Post({
      title: title,
      message: message,
      username: username,
      userRef: user._id,
    });
    const postEntry = await post.save();
    // const allPosts = await Post.find();
    // console.log("Post", postEntry);
    res.status(201).json(postEntry);
  } catch (err) {
    next(err);
  }
});

export default router;
