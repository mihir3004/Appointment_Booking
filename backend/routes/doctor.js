const express = require("express");
const router = express.Router();
const doctorControllers = require("../controller/doctor");
const appointments = require("../models/appointments");
const mongoose = require("mongoose");

// router.get("/", (req, res) => {
//     res.render("./doctor/dashboard");
// });
// router.get("/profile", (req, res) => {
//     res.render("./doctor/profile");
// });
router.post("/findMyAppointments", async (req, res) => {
    let date = new Date(req.body.date);
    console.log(req.body);
    date.setDate(date.getDate() - 1);
    console.log(date);
    const appointment = await appointments
        .find({
            doctorId: new mongoose.Types.ObjectId(req.body.doctor),
            date: { $gte: date },
            is_active: 1,
        })
        .populate({
            path: "patientId",

            select: "-password ",
        })
        .populate({
            path: "doctorId",

            select: "-password ",
        });
    console.log(appointment);
    res.send(appointment);
});
router.post("/deleteAppointment", async (req, res) => {
    console.log(req.body.id);
    let appointment = await appointments.findOne({ _id: req.body.id });

    appointment.status = "REJECTED";
    await appointment.save();
    res.send({ status: 1 });
});
router.post("/approveAppointment", async (req, res) => {
    console.log(req.body.id);
    let appointment = await appointments.findOne({ _id: req.body.id });
    appointment.status = "APPROVED";
    await appointment.save();
    res.send({ status: 1 });
});
module.exports = router;
