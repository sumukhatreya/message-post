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
    const res = jwt.verify(token, jwtSecret);
    console.log("Verified payload", res);
    console.log("Payload", res.username, "Payload type", typeof res.username);
    return true;
    // if (token) {
    //   const res = jwt.verify(token, jwtSecret); // unsure if this line of code will work as intended - I hope this throws an error that will be caught in the catch block if the jwt is invalid (the documentation says it does, but not sure how to test this).
    //   console.log("Verified payload", res);
    //   console.log("Payload", res.username, "Payload type", typeof res.username);
    //   // return res.username;
    //   return true;
    // } else {
    //   // throw new Error("Token not found");
    //   return false;
    // }
  } catch (err) {
    console.log(err);
    return false;
  }
};
