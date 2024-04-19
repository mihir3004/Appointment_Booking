const express = require("express");
const router = express.Router();
const doctorControllers = require("../controller/doctor");
router.get("/", (req, res) => {
    res.render("./doctor/dashboard");
});
router.get("/profile", (req, res) => {
    res.render("./doctor/profile");
});
module.exports = router;
