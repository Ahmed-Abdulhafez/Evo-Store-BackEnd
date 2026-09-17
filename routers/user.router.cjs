const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/user.controller.cjs")
const authMiddlware = require("../middlewares/authMiddleware.cjs");
const { isAdmin } = require("../middlewares/isAdmin.middleware.cjs")

// API GET All Users
router.get("/api/users", userControllers.getAllUsers)

router.post("/api/register/users", userControllers.registerUesr)

router.post("/api/login/users", userControllers.login)

// API GET Profile
router.get("/api/users/profile", authMiddlware, userControllers.getProfile);

// API Update Profile
router.put("/api/users/profile", authMiddlware, userControllers.updateProfile);

// API Get a user by ID
router.get("/api/users/:id", authMiddlware, isAdmin, userControllers.getUserById);

// API Delete User
router.delete("/api/users/:id", authMiddlware, isAdmin, userControllers.deleteUser);


module.exports = router;
