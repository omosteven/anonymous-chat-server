const jwt = require("jsonwebtoken");

class Helpers {
  static generateToken(email) {
    const jwtKey = "anon_app";

    const jwtExpirySeconds = 604800;
    // For a week

    const token = jwt.sign(
      {
        email,
      },
      jwtKey,
      {
        algorithm: "HS256",

        expiresIn: jwtExpirySeconds,
      }
    );

    return token;
  }
}

module.exports = Helpers;
