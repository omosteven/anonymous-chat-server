const {
  getUserInfo,
  getUserOnlineStatus,
  setUserOnlineStatus,
} = require("./SocketActions");

const socketEvents = require(".");

const { GET_USER_DETAILS, GET_USER_ONLINE_STATUS, SET_USER_ONLINE } =
  socketEvents;

const socketHandler = (socket) => {
  const { userId, thirdUserId } = socket.client?.request?._query || {};

  socket.on(GET_USER_DETAILS, () => {
    if (thirdUserId) {
      return getUserInfo(thirdUserId, socket);
    }
  });

  socket.on(GET_USER_ONLINE_STATUS, () => {
    if (thirdUserId) {
      return getUserOnlineStatus(thirdUserId, socket);
    }
  });

  socket.on("connected", function () {
    if (userId) {
      return setUserOnlineStatus(userId, true, socket);
    }
  });

  if (userId) {
    return setUserOnlineStatus(userId, true, socket);
  }

  socket.on("disconnect", function () {
    if (userId) {
      return setUserOnlineStatus(userId, false, socket);
    }
  });
};

module.exports = socketHandler;
