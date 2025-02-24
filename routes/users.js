const express = require("express")
const passport = require("passport")
const catchAsync = require("../utils/catchAsync")
const router = express.Router()
const users = require("../controllers/users")

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser))

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }), catchAsync(users.loginUser))

router.get("/logout", users.logoutUser)

module.exports = router