const {
  authenticateUser,
  updateUser,
  getRandomUser,
} = require("../controllers/UserController");
const auth = require("../middleware");

const router = require("express").Router();

router.post("/authenticate", authenticateUser);

router.patch("/user/update", auth, updateUser);

router.get("/user/random", auth, getRandomUser);

module.exports = router;
