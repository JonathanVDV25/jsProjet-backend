var express = require("express");
var router = express.Router();
const { Users } = require("../model/users");
const userModel = new Users();

// Register user
router.post("/register", async function (req, res, next) {
  // Error 400 if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.register(
    req.body.username,
    req.body.password
  );
  // Error 409 if the username already exists
  if (!authenticatedUser) return res.status(409).end();

  // Create session data for the cookies
  req.session.username = authenticatedUser.username;
  req.session.token = authenticatedUser.token;

  return res.json({ username: authenticatedUser.username });
});

// login user
router.post("/login", async function (req, res, next) {
  //Error 400 if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.login(
    req.body.username,
    req.body.password
  );
  // Error 401 if the user could not be authenticated
  if (!authenticatedUser) return res.status(401).end();

  // Create session data for the cookies
  req.session.username = authenticatedUser.username;
  req.session.token = authenticatedUser.token;

  return res.json({ username: authenticatedUser.username });
});

// Logout user
router.get("/logout", async function (req, res, next) {
  req.session = null;
  return res.status(200).end();
});

module.exports = router;