const jwt = require("jsonwebtoken");
const jwtSecret = "ilovemypizza!";

const { Users } = require("../model/users");
const userModel = new Users();

const verifyTokenAndAdmin = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    // check if decoded.username exists in users
    const userFound = userModel.getOneByUsername(decoded.username);

    if (!userFound) return false;

    if (userFound.username !== "admin") return false;

    return true;
  } catch (err) {
    console.error("verifyTokenAndAdmin: ", err);
    throw err;
  }
};

module.exports = { verifyTokenAndAdmin };
