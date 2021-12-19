/***************************************************************************************
*    Title: <js-demos>
*    Author: <Raphael baroni>
*    Date: <29/10>
*    Code version: <e19946b>
*    Availability: <https://github.com/e-vinci/js-demos/tree/main/backend-restful-api/restful-api-essentials/step8>
*
***************************************************************************************/

const fs = require("fs");
const { syncBuiltinESMExports } = require("module");
const path = require("path");

/**
 * Parse items given in a .json file
 * @param {String} filePath - path to the .json file
 * If the file does not exist or it's content cannot be parsed as JSON data,
 * use the default data.
 * @param {Array} defaultArray - Content to be used when the .json file does not exists
 * @returns {Array} : the array that was parsed from the file (or defaultData)
 */
function parse(filePath, defaultArray = []) {
  if (!fs.existsSync(filePath)) return defaultArray;
  let fileData = fs.readFileSync(filePath);
  try {
    // parse() Throws a SyntaxError exception if the string to parse is not valid JSON.
    return JSON.parse(fileData);
  } catch (err) {
    return defaultArray;
  }
}

/**
 * Serialize the content of an Object within a file
 * @param {String} filePath - path to the .json file
 * @param {Array} object - Object to be written within the .json file.
 * Even if the file exists, its whole content is reset by the given object.
 */
function serialize(filePath, object) {
  // creates a data folder when not exists
  if(!fs.existsSync("data/")) {
    fs.mkdirSync("data/");
  }
  console.log(object);
  const objectSerialized = JSON.stringify(object);
  console.log(objectSerialized);
  fs.writeFileSync(filePath, objectSerialized);
}

module.exports = { parse, serialize };
