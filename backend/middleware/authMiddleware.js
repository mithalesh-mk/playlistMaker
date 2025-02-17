const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    // Checking if the token exists in cookies
    const token = req.cookies.token; // Ensure the cookie name matches

    if (!token) {
      return res.status(401).send({
        message: "Authentication failed: No token provided",
        success: false,
      });
    }

    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attaching the decoded userId to req.user for further use
    req.user = { userId: decoded.userId };

    // Proceeding to the next middleware or route handler
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
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
