import jwt from "jsonwebtoken";
import Promise from "bluebird";
import { jwtSecret } from "../../config";

// const jwtSign = Promise.promisify(jwt.sign)
// const jwtVerify = Promise.promisify(jwt.verify)

// export const sign = (id, options, method = jwtSign) =>
//   method({ id }, jwtSecret, options)

// export const signSync = (id, options) => sign(id, options, jwt.sign)

// export const verify = (token) => jwtVerify(token, jwtSecret)

export const createJWT = (username, expiration) => {
  return jwt.sign({ username }, jwtSecret, {
    expiresIn: expiration,
  });
};

// Function that takes as input a reference to the request object and returns the JWT payload (username in this case) if the token is valid, and an empty string if invalid.
export const verifyJWT = (token) => {
  try {
    // const token = req.header.jwt;
    console.log("jwt token", token);
    if (token) {
      console.log("Why is this piece of code executing?", token);
      const res = jwt.verify(token, jwtSecret);
      console.log("Verified payload", res);
      console.log("Payload", res.username, "Payload type", typeof res.username);
      return { username: res.username, valid: true };
    }
    // return true;
  } catch (err) {
    console.log(err);
    return { valid: false };
    // return false;
  }
};
