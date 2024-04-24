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
router.post("/findMyAppointments", async (req, res) => {
    let date = new Date(req.body.date);
    date.setDate(date.getDate() - 1);
    const appointment = await appointments
        .find({
            patientId: new mongoose.Types.ObjectId(req.body.patient),
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
    // console.log(appointment);
    res.send(appointment);
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
        is_active: 1,
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
    }
    let isDoctorAvailable = true;

    appointment.forEach((element) => {
        console.log(new Date(element.end).getHours(), requestStartTime);
        if (
            new Date(element.end).getHours() <= requestStartTime ||
            new Date(element.start).getHours() >= requestStartTime
        ) {
            isDoctorAvailable = false;
        }
    });

    if (isDoctorAvailable) {
        res.send({ status: 0, message: "Doctor is Available" });
    } else {
        res.send({ status: 1, message: "Doctor is Not Available" });
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
            is_active: 1,
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
            is_active: 1,
        });
        await newAppointment.save();
        res.send({ status: 0, message: "Your Appointment has been booked" });
        return;
    }
});
router.post("/deleteAppointment", async (req, res) => {
    // console.log(req.body.id);
    let appointment = await appointments.findOne({ _id: req.body.id });
    appointment.is_active = 0;
    await appointment.save();
    res.send({ status: 1 });
});
module.exports = router;
