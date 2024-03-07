import bcrypt from "bcryptjs";

//function to hash the password before saving into db
export const toHashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

//verifying the password given by user with hashed password
export const verifyPassword = async (
  uiPassword: string,
  dbPassword: string
) => {
  const isPasswordCorrect = await bcrypt.compare(uiPassword, dbPassword);
  return isPasswordCorrect;
};
