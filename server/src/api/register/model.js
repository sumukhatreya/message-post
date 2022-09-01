// const mongoose = require("mongoose");
import mongoose from "mongoose";
import { hashPassword } from "./utils";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    console.log("User about to be saved to db", this);
    this.username = this.username.trim();
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("user", userSchema);
export default User;
