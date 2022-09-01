import bcrypt from "bcrypt";

export const hashPassword = async (userPassword) => {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(userPassword, salt);
  return password;
};
