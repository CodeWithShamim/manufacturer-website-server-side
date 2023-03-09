const jwt = require("jsonwebtoken");

// -- verify jwt--
module.exports = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    if (decoded) {
      req.decoded = decoded;
      next();
    }
  });
};
