const express = require("express")
const router = express.Router()

//Importing controller
const authController = require("../controller/auth")

router.post("/register",authController.registerUser)
router.post("/login", authController.login)
router.post("/user",authController.authorizeToken,authController.getUser)
router.post("/logout", authController.logout)


module.exports = router