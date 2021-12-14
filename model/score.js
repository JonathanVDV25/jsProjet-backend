"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const { Users } = require("../model/users");

const jsonDbPath = __dirname + "/../data/scores.json";

// Default score menu
const defaultScores = [
  {
    name: "Score_De_Base_A_Battre",
    distance: 200,
  },
];

class Scores {
  constructor(dbPath = jsonDbPath, defaultItems = defaultScores) {
    this.jsonDbPath = dbPath;
    this.defaultScores = defaultItems;
  }

  /**
   * Returns all Scores
   * @returns {Array} Array of scores
   */
  getAll() {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    return scores;
  }

  /**
   * Returns the scores identified by the name
   * @param {object} name - name of the player to find
   * @returns {object} the score found or undefined if the id does not lead to a score
   */
  getOne(name) {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    const foundIndex = scores.findIndex((score) => score.name == name);
    if (foundIndex < 0) return;

    return scores[foundIndex];
  }

  /**
   * Add a score in the DB and returns the added score (containing a new id)
   * @param {object} body - it contains all required data to create a score
   * @returns {object} the score that was created (with id)
   */

  addOne(body) {
    const scores = parse(this.jsonDbPath, this.defaultScores);

    // add new score to the menu : escape the title & content in order to protect agains XSS attacks    
    const newScore = {
      name: escape(body.name),
      distance: escape(body.distance),
    };
    scores.push(newScore);
    serialize(this.jsonDbPath, scores);
    return newScore;
  }

  /**
   * Update a score in the DB and return the updated score
   * @param {object} name - name of the user to be updated
   * @param {object} body - it contains the distance to be updated
   * @returns {object} the updated score or undefined if the update operation failed
   */
  updateOne(name, body) {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    const foundIndex = scores.findIndex((score) => score.name == name);
    if (foundIndex < 0) return;
    // create a new object based on the existing score - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updatedScore = { ...scores[foundIndex], ...body };
    // replace the score found at index : (or use splice)
    scores[foundIndex] = updatedScore;

    serialize(this.jsonDbPath, scores);
    return updatedScore;
  }
}

module.exports = { Scores };