const {
  authenticateUser,
  updateUser,
} = require("../controllers/UserController");
const auth = require("../middleware");

const router = require("express").Router();

router.post("/authenticate", authenticateUser);

router.patch("/user/update", auth, updateUser);

module.exports = router;
