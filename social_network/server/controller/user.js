const User = require("../models/User");

exports.updateUser = (req, res, next) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{
			$set: {
				name: req.body.name,
				email: req.body.email,
				gender: req.body.gender,
				phone: req.body.phone,
				pic: req.file?.filename,
			},
		},
		{ new: true }
	)
		.then((data) => {
			res.send({ type: "success", msg: "Successfully updated profile" });
		})
		.catch((err) => {
			console.log(err);
			res.send({ type: "error", msg: "Failed to update the profile" });
		});
};

exports.getPic = (req, res, next) => {
	const picName = req.params.userpic;
	res.sendFile(picName, { root: "media/user" });
	// User.findOne({ _id: req.user._id })
	// 	.then((usr) => {
	// 		if (usr) {
	// 			res.sendFile(usr.pic, { root: "media/user" });
	// 		}
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 		res.send({ type: "error", msg: "File not found" });
	// 	});
	// res.send("djkf")
};

exports.getPersonList = (req, res) => {
	User.find({ _id: { $ne: req.user._id } }, { _id: 1, name: 1, pic: 1 })
		.then((usrs) => {
			res.send(usrs);
		})
		.catch((err) => {
			console.log(err);
			res.send({ type: "error", msg: "Failed to fetch persons" });
		});
};

exports.sendFriendRequest = (req, res) => {
	const loggedInUserId = req.user._id;
	const otherUserId = req.body.userId;
	User.updateOne(
		{ _id: req.body.userId },
		{ $push: { friendRequest: { userId: loggedInUserId } } }
	)
		.then((doc) => {
			if (doc.modifiedCount) {
				User.updateOne(
					{ _id: req.user._id },
					{ $push: { sentFriendRequest: { userId: otherUserId } } }
				)
					.then((doc) => {
						res.send({
							type: "success",
							msg: "Friend Request sent",
						});
					})
					.catch((err) => {
						console.log(err);
						res.send({
							type: "error",
							msg: "Failed to send friend Request",
						});
					});
			}
		})
		.catch((err) => {
			console.log(err);
			res.send({ type: "error", msg: "Failed to send friend Request" });
		});
};

exports.getFriendsRequestList = (req, res) => {
	User.findOne({ _id: req.user._id })
		.then((usr) => {
			let friendsRequestIdList = usr.friendRequest.map(
				(item) => item.userId
			);
			User.find(
				{ _id: { $in: friendsRequestIdList } },
				{ _id: 1, name: 1, pic: 1 }
			)
				.then((usrList) => {
					res.send(usrList);
				})
				.catch((err) => {
					console.log(err);
					res.send({ type: "error", msg: "Some Problem Occured" });
				});
		})
		.catch((err) => {
			console.log(err);
			res.send({
				type: "error",
				msg: "Failed to fetch the friend requests",
			});
		});
};

// [{userId : 1}{userId : 2}{userId : 3}]
// [1,2,3]

exports.getFriendsList = (req, res) => {
	User.findOne({ _id: req.user._id })
		.then((usr) => {
			let friendsIdList = usr.friends.map((item) => item.userId);
			User.find(
				{ _id: { $in: friendsIdList } },
				{ _id: 1, name: 1, pic: 1 }
			)
				.then((usrList) => {
					res.send(usrList);
				})
				.catch((err) => {
					console.log(err);
					res.send({ type: "error", msg: "Some Problem Occured" });
				});
		})
		.catch((err) => {
			console.log(err);
			res.send({
				type: "error",
				msg: "Failed to fetch the friends",
			});
		});
};

exports.approveRequest = (req, res) => {
	console.log(req.body)
	let approvedUser = req.body;
	let currentUserId = req.user._id;
	User.findOne({ _id: currentUserId })
		.then(async (usr) => {
			let friendRequestArr = usr.friendRequest.filter(
				(item) => approvedUser._id == item.userId
			);
			if (friendRequestArr.length > 0) {
				let currentUserUpdateStatusDoc = await User.updateOne(
					{ _id: currentUserId },
					{
						"$push": { friends: { userId: approvedUser._id } },
						"$pull": { friendRequest: { userId: approvedUser._id } },
					}
				);
				let approvedUserUpdateStatusDoc = await User.updateOne(
					{ _id: approvedUser._id },
					{
						$push: { friends: { userId: currentUserId } },
						$pull: { sentFriendRequest: { userId: currentUserId } },
					}
				);

				//currentUserUpdateStatusDoc.modifiedCount 
				//Compare modifed count then respond
				res.send({type : "success", msg : "Approved Successfully"})

			} else {
				res.send({ type: "error", msg: "Wrong Friend Request" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.send({ type: "error", msg: "Failed to approve request" });
		});
};
