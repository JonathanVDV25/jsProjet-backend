/***************************************************************************************
*    Title: <js-demos>
*    Author: <Raphael baroni>
*    Date: <29/10>
*    Code version: <e19946b>
*    Availability: <https://github.com/e-vinci/js-demos/tree/main/backend-restful-api/restful-api-essentials/step8>
*
***************************************************************************************/

const createSession = (req, username, token) => {
  req.session.username = username;
  req.session.token = token;
};

module.exports = { createSession };
