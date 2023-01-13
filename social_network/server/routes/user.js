const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const userController = require("../controller/user");
const multer = require("multer");
// const upload = multer({ dest: 'media/user' })
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "media/user");
	},
	filename: function (req, file, cb) {
		const temp = file.originalname.split(".");
		const ext = temp[temp.length - 1];
		const uniqueSuffix =
			Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});
const upload = multer({ storage: storage })

router.put("/", authController.authorizeToken,upload.single('pic'), userController.updateUser);
router.get("/pic/:userpic", authController.authorizeToken, userController.getPic)
router.post("/persons", authController.authorizeToken, userController.getPersonList)
router.post("/friendreq", authController.authorizeToken, userController.sendFriendRequest)
router.get("/friendreqlist", authController.authorizeToken, userController.getFriendsRequestList)
router.get("/friendslist", authController.authorizeToken, userController.getFriendsList)
router.post("/approvereq", authController.authorizeToken , userController.approveRequest)
// PUT /user -> update the user
module.exports = router;
// GET /user/pic/342442.jpg