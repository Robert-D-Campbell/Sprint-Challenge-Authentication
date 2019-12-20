const jwt = require("jsonwebtoken"); // installed this

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const secret =
      process.env.JWT_SECRET || "Mr. Roboto, Domo Domo. Domo Domo.";

    jwt.verify(authorization, secret, function(err, decodedToken) {
      if (err) {
        res.status(401).json({ message: "You shall not PASS!!!" });
      } else {
        req.token = decodedToken;

        next();
      }
    });
  } else {
    res.status(400).json({ message: "Please login and try again" });
  }
};
