const { Signup, Login } = require("../Controllers/AuthController");
const router = require("express").Router();
const { userVerification } = require("../Middlewares/AuthMiddleware");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);

// 👇 ADD THIS
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    withCredentials: true,
    httpOnly: false,
    expires: new Date(0), // cookie delete
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;