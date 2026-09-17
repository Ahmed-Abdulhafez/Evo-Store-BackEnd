const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const fullToken = req.headers.authorization;
    const token = fullToken?.split(" ")[1];

    console.log("fullToken", fullToken);
    console.log("token", token);

    if (!token) return res.status(403).send("Access Denied");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;

    console.log("decodedToken", decodedToken);
    console.log("req.user", req.user);
    
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid Token");
  }
};