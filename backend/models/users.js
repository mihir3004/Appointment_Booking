const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
    {
        name: String,
        role: String,
        email: String,
        phone: String,
        password: String,
        startTime: Date,
        endTime: Date,
        speciality: String,
        education: String,
        is_active: Number,
    },
    { timestamps: true }
);
const userModel = mongoose.model("users", usersSchema);
module.exports = userModel;
