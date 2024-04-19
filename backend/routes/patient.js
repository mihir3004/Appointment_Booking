const express = require("express");
const router = express.Router();
const patientControllers = require("../controller/patient");
const users = require("../models/users");
const appointments = require("../models/appointments");
const mongoose = require("mongoose");
// const appointments = require("../models/appointments");
router.get("/", (req, res) => {
    res.render("./patient/dashboard");
});
router.get("/findDoctors", async (req, res) => {
    const doctor = await users.find({ role: "DOCTOR", is_active: 1 });
    res.send(doctor);
});
router.post("/findAppointments", async (req, res) => {
    console.log(req.body);
    const id = new mongoose.Types.ObjectId(req.body.doctor);

    let startDate = new Date(req.body.date);
    console.log(startDate);
    let endDate = new Date(req.body.date);
    endDate.setDate(endDate.getDate() + 1); // Adding one day
    console.log(endDate);

    // return;
    const appointment = await appointments.find({
        doctorId: id,
        date: { $gte: startDate, $lte: endDate },
        status: { $ne: "REJECTED" },
    });
    console.log(appointment);
    let requestStartTime = new Date(req.body.startTime).getHours();
    let requestendTime = new Date(req.body.endTime).getHours();
    const doctor = await users.findOne({ _id: req.body.doctor });
    if (
        requestStartTime < new Date(doctor.startTime).getHours() ||
        requestendTime > new Date(doctor.endTime).getHours()
    ) {
        res.send({ status: 1, message: "Doctor is not Available" });
        return;
    }
    if (appointment.length == 0) {
        res.send({ status: 0, message: "Doctor is Available" });
        return;
    } else {
        // let flag = true;
        appointment.forEach((element) => {
            console.log(new Date(element.end).getHours(), requestStartTime);
            if (
                new Date(element.end).getHours() <= requestStartTime ||
                new Date(element.start).getHours() >= requestStartTime
            ) {
                res.send({ status: 1, message: "Doctor is Not Available" });
                return;
            }
        });
        res.send({ status: 0, message: "Doctor is Available" });
        return;
    }
});
router.post("/bookAppointment", async (req, res) => {
    // console.log(req.body);
    // return;
    const appointment = await appointments.find({
        doctorId: req.body.doctor,
        date: new Date(req.body.date),
        status: { $ne: "REJECTED" },
    });
    if (appointment.length == 0) {
        const newAppointment = new appointments({
            doctorId: req.body.doctor,
            patientId: req.body.patient,
            date: new Date(req.body.date),
            start: new Date(req.body.startTime),
            end: new Date(req.body.endTime),
            status: "PENDING",
        });
        await newAppointment.save();
        res.send({ status: 0, message: "Your Appointment has been booked" });
        return;
    } else {
        let requestStartTime = new Date(req.body.startTime).getHours();
        // let flag = true;
        appointment.forEach((element) => {
            if (
                new Date(element.end).getHours() <= requestStartTime &&
                new Date(element.start).getHours() >= requestStartTime
            ) {
                res.send({
                    status: 1,
                    message:
                        "Sorry Someone has Booked an Appointment just now!!",
                });
                return;
            }
        });
        const newAppointment = new appointments({
            doctorId: req.body.doctor,
            patientId: req.body.patient,
            date: new Date(req.body.date),
            start: new Date(req.body.startTime),
            end: new Date(req.body.endTime),
            status: "PENDING",
        });
        await newAppointment.save();
        res.send({ status: 0, message: "Your Appointment has been booked" });
        return;
    }
});
module.exports = router;
