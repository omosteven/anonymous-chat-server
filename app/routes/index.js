const {
  authenticateUser,
  updateUser,
  getRandomUser,
  getUser,
} = require("../controllers/UserController");
const auth = require("../middleware");

const router = require("express").Router();

router.post("/authenticate", authenticateUser);

router.get("/user/:userId", auth, getUser);

router.patch("/user/update", auth, updateUser);

router.get("/user/random", auth, getRandomUser);

module.exports = router;
