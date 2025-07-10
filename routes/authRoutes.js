const express = require("express");
const router = express.Router();
const isAuthenticated  = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

// Protected test route
router.get("/profile", isAuthenticated, (req, res) => {
  const user = req.user;
  res.json({ success: true, result: { user } });
});

// Protected admin route (must be authenticated AND an admin)
router.get("/admin/dashboard", isAuthenticated, isAdmin, (req, res) => {
  res.json({
    message: "Welcome, admin",
    user: req.user,
  });
});

module.exports = router;
