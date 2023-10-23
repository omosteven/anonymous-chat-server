const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UserModel");

const auth = async (req, res, next) => {
  if (req.headers["x-access-token"] || req.headers.authorization) {
    const token =
      (await req.headers["x-auth-token"]) ||
      (await req.headers.authorization.replace("Bearer ", ""));

    try {
      const verifiedUser = await jwt.verify(token, "anon_app");

      const user = await UsersModel.findOne({ token });

      if (!user) {
        return res.status(401).json({ message: "Access Denied" });
      }

      let userData = { ...user?._doc, password: undefined };
      req.user = userData;
      req.token = token;

      // --- Added this part for update password, and to avoid unnecessary addition to the run time of the implementation ---
      const { newPassword, oldPassword } = req.body;

      if (newPassword && oldPassword) {
        if ((newPassword.length < 8) | (oldPassword.length < 8)) {
          return res.status(400).json({ message: "Password(s) too short." });
        }

        if (newPassword === oldPassword) {
          return res
            .status(400)
            .json({ message: "Passwords cannot be the same." });
        }

        if (!bcrypt.compareSync(oldPassword, user?.password)) {
          return res.status(404).json({ message: "Incorrect old password." });
        }
      }

      next();
    } catch (err) {
      console.log({ err });
      return res.status(401).json({ message: "Access Denied" });
    }
  } else {
    return res.status(401).json({ message: "Access Denied" });
  }
};

module.exports = auth;
