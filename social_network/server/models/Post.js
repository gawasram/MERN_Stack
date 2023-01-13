const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Types.ObjectId, requied: true, ref: 'user' },
		postText: { type: String },
		postImage: { type: String },
		postVideo: { type: String },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("post", PostSchema);
