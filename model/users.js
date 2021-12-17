"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { parse, serialize } = require("../utils/json");
const jwtSecret = "ChronoRun";
const LIFETIME_JWT = 2 * 60 * 60 * 1000; // in ms : 2 * 60 * 60 * 1000 = 2h
const jsonDbPath = __dirname + "/../data/users.json";
const saltRounds = 10;

const defaultItems = [
  {
    username: "admin",
    password: "$2b$10$RqcgWQT/Irt9MQC8UfHmjuGCrQkQNeNcU6UtZURdSB/fyt6bMWARa",
  },
];

class Users {
  constructor(dbPath = jsonDbPath, items = defaultItems) {
    this.jsonDbPath = dbPath;
    this.defaultItems = items;
  }

  /**
   * Returns the item identified by username
   * @param {string} username - username of the item to find
   * @returns {object} the item found or undefined if the username does not lead to a item
   */
  getOneByUsername(username) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.username == username);
    if (foundIndex < 0) return;

    return items[foundIndex];
  }

  /**
   * Add a item in the DB and returns - as Promise - the added item (containing a new id)
   * @param {object} body - it contains all required data to create a item
   * @returns {Promise} Promise reprensents the item that was created (with id)
   */
  async addOne(body) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const newitem = {
      username: body.username,
      password: hashedPassword,
    };
    items.push(newitem);
    serialize(this.jsonDbPath, items);
    return newitem;
  }


  /**
   * Authenticate a user and generate a token if the user credentials are OK
   * @param {*} username
   * @param {*} password
   * @returns {Promise} Promise reprensents the authenticatedUser ({username:..., token:....}) or undefined if the user could not
   * be authenticated
   */
  async login(username, password) {
    const userFound = this.getOneByUsername(username);
    if (!userFound) return;
    const match = await bcrypt.compare(password, userFound.password);
    if (!match) return;

    const authenticatedUser = {
      username: username,
      token: "Future signed token",
    };

    // replace expected token with JWT : create a JWT
    const token = jwt.sign(
      { username: authenticatedUser.username }, // session data in the payload
      jwtSecret, // secret used for the signature
      { expiresIn: LIFETIME_JWT } // lifetime of the JWT
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }

  /**
   * Create a new user in DB and generate a token
   * @param {*} username
   * @param {*} password
   * @returns the new authenticated user ({username:..., token:....}) or undefined if the user could not
   * be created (if username already in use)
   */
  async register(username, password) {
    const userFound = this.getOneByUsername(username);
    if (userFound) return;

    const newUser = await this.addOne({ username: username, password: password });

    const authenticatedUser = {
      username: username,
      token: "Future signed token",
    };

    const token = jwt.sign(
      { username: authenticatedUser.username }, // session data in the payload
      jwtSecret, // secret used for the signature
      { expiresIn: LIFETIME_JWT } // lifetime of the JWT
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }
}

module.exports = { Users };