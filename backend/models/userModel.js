const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(

    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure email is unique
        },
        password: {
            type: String,
            required: true,
        },
        bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
        profilePic: {
            type: String,
            default: "",
        },
        otp: {
            type: String, // Storing OTP as a string
            default: null, // Default is null (no OTP initially)
        },
        otpExpires: {
            type: Number, // Store timestamp (Date.now() + expiry time)
            default: null,
        },
    },
    { timestamps: true }

);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
