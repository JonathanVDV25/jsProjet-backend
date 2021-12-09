var express = require("express");
const { Scores } = require("../model/score");
const { authorizeFromCookie } = require("../utils/authorize");

var router = express.Router();
const scoreModel = new Scores();

// GET /scores : read all the scores from the leaderboard
router.get("/", function (req, res) {
  console.log("GET /scores");
  console.log("scores:", scoreModel.getAll())
  return res.json(scoreModel.getAll());
});

// GET /scores/{name} : Get a score from its name in the leaderboard
router.get("/:name", function (req, res) {
  console.log(`GET /scores/${req.params.name}`);

  const score = scoreModel.getOne(req.params.name);
  // Send an error code '404 Not Found' if the name was not found
  if (!score) return res.status(404).end();

  return res.json(score);
});


// POST /scores : create a score to be added to the leaderboard.
// This shall be authorized only to admin user which possesses a valid JWT
// authorize Middleware : it authorize any authenticated user and load the user in req.user
router.post("/", authorizeFromCookie, function (req, res) {
  console.log("POST /scores");
    // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
    (req.body.hasOwnProperty("distance") && req.body.distance.length === 0) ||
    (scoreModel.getOne(req.body.name)) // Renvoie une erreur si le nom est déjà présent !
  )
    return res.status(400).end();
    console.log(req.body.name);

  //if (req.user.username !== "admin") return res.status(403).end();

  const score = scoreModel.addOne(req.body);

  return res.json(score);
});


// PUT /scores/{name} : update a score at name
// This shall be authorized only to admin user which possesses a valid JWT
router.put("/:name", function (req, res) {
  console.log(`PUT /scores/${req.params.name}`);
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
    (req.body.hasOwnProperty("distance") && req.body.distance.length === 0)
  )
    return res.status(400).end();

  //if (req.user.username !== "admin") return res.status(403).end();

  const score = scoreModel.updateOne(req.params.name, req.body);
  // Send an error code 'Not Found' if the score was not found :
  if (!score) return res.status(404).end();
  return res.json(score);
});

module.exports = router;
