var express = require("express");
const { Scores } = require("../model/score");
const { authorizeFromCookie } = require("../utils/authorize");
var escape = require("escape-html");

var router = express.Router();
const scoreModel = new Scores();

// read all the scores from the leaderboard
router.get("/", function (req, res) {
  console.log("GET /scores");
  console.log("scores:", scoreModel.getAll())
  return res.json(scoreModel.getAll());
});

// Get a score from its name in the leaderboard
router.get("/:name", function (req, res) {
  console.log(`GET /scores/${req.params.name}`);

  const score = scoreModel.getOne(req.params.name);
  // Error 404 if the name was not found
  if (!score) return res.status(404).end();

  return res.json(score);
});


// create a score to be added to the leaderboard.
router.post("/", authorizeFromCookie, function (req, res) {
  console.log("POST /scores");
  var name = escape(req.body.name)
    // Error 400 if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
    (req.body.hasOwnProperty("distance") && req.body.distance.length === 0) ||
    (scoreModel.getOne(name)) // send error if name already exists
  )
    return res.status(400).end();

  const score = scoreModel.addOne(req.body);
  return res.json(score);
});


// update a score at name
router.put("/:name", function (req, res) {
  console.log(`PUT /scores/${req.params.name}`);
  // Error 400 if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
    (req.body.hasOwnProperty("distance") && req.body.distance.length === 0)
  )
    return res.status(400).end();

  const score = scoreModel.updateOne(req.params.name, req.body);
  // Error 'Not Found' if the score was not found
  if (!score) return res.status(404).end();
  return res.json(score);
});

module.exports = router;