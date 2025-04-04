const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    // Extracting token from the Authorization header (Bearer <token>)
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        message: "Authentication failed: No token provided",
        success: false,
      });
    }

    // Bearer token format (Bearer <token>)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        message: "Authentication failed: No token provided",
        success: false,
      });
    }

    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attaching the decoded userId to req.user for further use
    req.body.userId = decoded.userId;

    // Proceeding to the next middleware or route handler
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token has expired");
      return res.status(401).send({
        message: "Token has expired",
        success: false,
      });
    }

    // General error for invalid token or verification failure
    return res.status(401).send({
      message: "Authentication failed",
      success: false,
    });
  }
};
