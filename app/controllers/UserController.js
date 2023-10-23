const payloadChecker = require("payload-validator");
// const validator = require("validator");
const UsersModel = require("../models/UserModel");
const { generateToken } = require("../helpers");

class UserController {
  static async authenticateUser(req, res) {
    let { email } = req.body;

    let expectedPayload = {
      email: "",
    };

    let payloadCheckRes = payloadChecker.validator(req.body, expectedPayload);

    if (!payloadCheckRes.success) {
      return res
        .status(400)
        .json({ message: payloadCheckRes.response.errorMessage });
    }

    let token = generateToken(email);

    let getUser = "";

    try {
      getUser = await UsersModel.findOneAndUpdate(
        { email, isOnline: true },
        { token }
      );
    } catch (e) {
      return res.status(403).json({
        message: "An error occurred",
      });
    }

    if (getUser) {
      return res.status(200).json({
        token,
        user: getUser,
        message: "User Authenticated",
      });
    } else {
      const newUser = new UsersModel({ email, token, isOnline: true });

      newUser.save
        .then((resp) => {
          return res.status(200).json({
            token,
            user: newUser,
            message: "User Authenticated",
          });
        })
        .catch((e) => {
          return res.status(403).json({
            message: "An error occurred",
          });
        });
    }
  }

  static deleteUser() {}

  static async updateUser(req, res) {
    const { token } = req.user;

    try {
      await UsersModel.findOneAndUpdate(
        { token },
        {
          $push: req.body,
        },
        {
          useFindAndModify: false,
          new: true,
        },
        (err, resp) => {
          if (err) {
            return res.status(403).json({
              message: "An error occurred",
            });
          }

          if (resp === null) {
            return res.status(404).json({
              message: "User not found",
            });
          } else {
            return res.status(200).json({
              message: "User update succesful",
              data: resp,
            });
          }
        }
      );
    } catch (e) {
      return res.status(403).json({
        message: "An error occurred",
      });
    }
  }

  static setUserOnlineStatus() {}
}

module.exports = UserController;
