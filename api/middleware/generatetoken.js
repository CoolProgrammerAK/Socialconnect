const jwt = require("jsonwebtoken");
exports.createJWT = (data) => {
  
   return jwt.sign(data, process.env.TOKEN_ID);
};