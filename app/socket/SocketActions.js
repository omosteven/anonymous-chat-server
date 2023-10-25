const socketEvents = require(".");

const { GET_USER_DETAILS, GET_USER_ONLINE_STATUS, SET_USER_ONLINE } =
  socketEvents;

const UsersModel = require("../models/UserModel");

class SocketActions {
  static async getUserOnlineStatus(userId, socketIO) {
    try {
      const userStatus = await UsersModel.findOne(
        { _id: userId },
        { isOnline: 1, _id: 1 }
      );

      return socketIO.emit(GET_USER_ONLINE_STATUS, {
        data: userStatus,
        status: "success",
      });
    } catch (e) {
      return socketIO.emit(GET_USER_ONLINE_STATUS, {
        status: "failed",
      });
    }
  }

  static async setUserOnlineStatus(userId, isOnline, socketIO) {
    try {
      await UsersModel.updateOne({ _id: userId }, { isOnline });

      return socketIO.emit(SET_USER_ONLINE, {
        status: "success",
      });
    } catch (e) {
      return socketIO.emit(SET_USER_ONLINE, {
        status: "failed",
      });
    }
  }

  static async getUserInfo(userId, socketIO) {
    try {
      const user = await UsersModel.findOne(
        { _id: userId },
        {
          _id: 1,
          email: 1,
          userName: 1,
          city: 1,
          state: 1,
          country: 1,
          isOnline: 1,
        }
      );

      return socketIO.emit(GET_USER_DETAILS, {
        data: user,
        status: "success",
      });
    } catch (e) {
      return socketIO.emit(GET_USER_DETAILS, {
        status: "failed",
      });
    }
  }
}

module.exports = SocketActions;
