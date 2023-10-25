const express = require("express");

const dotenv = require("dotenv");

const bodyParser = require("body-parser");

const cors = require("cors");

const AppRoutes = require("./app/routes/index.js");

const connectDb = require("./config/Database");
const socketHandler = require("./app/socket/SocketHandlers.js");

dotenv.config();

const app = express();

const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.use(express.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: false }));
app.use(bodyParser.json({ limit: "200mb" }));

//connecting the database
connectDb();

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  return res.status(status).json({ message: message, statusCode: status });
});

app.use("/api/v1", AppRoutes);

app.use("/*", (req, res) => {
  return res.status(404).json({
    message: "You missed the right route",
    route: req.originalUrl,
  });
});

let port = process.env.PORT || 8000;

socketIO.on("connection", function (socket) {
  // socketHandler(socket);
});

http.listen(port, function () {
  console.log("App is running");
});

module.exports = socketIO;

// const server = app.listen(port, () => {
//   host = server.address().address;

//   port = server.address.port;

//   console.log("Server running at " + port);
// });
