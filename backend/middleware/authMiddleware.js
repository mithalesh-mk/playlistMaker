const jwt = require("jsonwebtoken");
require("dotenv").config();

// Here checking if user is authorize to access it or not this will be check here
module.exports = (req, res, next) => {
  try {
    //spliting based on whitespace because header part look like "bearer token"
    //So token will only have token
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.send({
        message: "Auth failed",
        success: false,
        data: null,
      });
    }

    // jwt.verify if not verified then it will throw an error then catch block will be executed
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //now decoded hash user object
    req.body.userId = decoded.userId;
    //next will call the route where api called middleware
    return next();
  } catch (error) {
    return res.send({
      message: "Authentication failed",
      success: false,
    });
  }
};
