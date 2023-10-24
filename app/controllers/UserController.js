const validator = require("validator");

const UsersModel = require("../models/UserModel");

const { generateToken } = require("../helpers");

class UserController {
  static async authenticateUser(req, res) {
    let { email } = req.body;

    if (!email?.length) {
      return res.status(400).json({ message: "Email is required" });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email provided" });
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

      newUser
        .save()
        .then((resp) => {
          return res.status(200).json({
            token,
            user: newUser,
            message: "User Authenticated",
          });
        })
        .catch((e) => {
          console.log(e);
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
      const userData = await UsersModel.findOneAndUpdate(
        { token },
        {
          ...req.body,
        },
        {
          useFindAndModify: false,
          new: true,
        }
      );

      if (userData === null) {
        return res.status(404).json({
          message: "User not found",
        });
      } else {
        return res.status(200).json({
          message: "User update succesfull",
          data: userData,
        });
      }
    } catch (e) {
      return res.status(403).json({
        message: "An error occurred",
      });
    }
  }

  static setUserOnlineStatus() {}

  static async getRandomUser(req, res) {
    let { token } = req.user;
    try {
      const randomUser = await UsersModel.aggregate([
        {
          $sample: { size: 1 },
        },
        { $match: { isOnline: true, token: { $ne: token } } },
        {
          $project: {
            _id: 1,
            email: 1,
            userName: 1,
            city: 1,
            state: 1,
            country: 1,
          },
        },
      ]);
      // const randomUser = await UsersModel.findOne(
      //   { isOnline: true },
      //   { _id: 1, email: 1, userName: 1, city: 1, state: 1, country: 1 }
      // );
      return res.status(randomUser?.length === 0 ? 403 : 202).json({
        message: randomUser?.length === 0 ? "An error occurred" : "Chat session started",
        data: randomUser[0],
      });
    } catch (e) {
      return res.status(403).json({
        message: "An error occurred",
      });
    }
  }
}

module.exports = UserController;
