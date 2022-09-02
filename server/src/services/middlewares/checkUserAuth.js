import { verifyJWT } from "../jwt";

export const checkIfUserLoggedIn = (req, res, next) => {
  const token = req.get("jwt");
  if (token && verifyJWT(token).valid) {
    console.log("Token from inside checkUserAuth", token);
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};
