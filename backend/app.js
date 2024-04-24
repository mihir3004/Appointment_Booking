const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const users = require("./models/users");
const app = express();
const cors = require("cors");
app.use(cors());
app.set("views", path.join("views", ""));
app.set("view engine", "ejs");
app.use(express.static("public"));
const bodyParser = require("body-parser");
const { name } = require("ejs");

mongoose.connect("mongodb://localhost:27017/Appointment_Booking");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
    console.log(req.body);
    const user = await users.findOne(
        {
            name: req.body.username,
            password: req.body.password,
            role: req.body.role,
        },
        { password: 0 }
    );
    res.send({ user: user });
});

app.post("/register", async (req, res) => {
    const data = req.body;
    let user;
    if (data.role == "DOCTOR") {
        console.log(data);
        user = new users({
            name: data.username,
            password: data.password,
            education: data.education,
            speciality: data.speciality,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            role: "DOCTOR",
            email: data.email,
            phone: data.phone,
            is_active: 1,
        });
    } else {
        user = new users({
            name: data.username,
            is_active: 1,
            password: data.password,
            role: "PATIENT",
            email: data.email,
            phone: data.phone,
        });
    }
    let newUser = await user.save();
    res.send({ _id: newUser._id, role: newUser.role });
});
// app.get("/logout", (req, res) => {
//     res.redirect("/");
// });
app.listen(3000, () => {
    console.log("http://localhost:3000");
});

const patientRoutes = require("./routes/patient");
app.use("/patient", patientRoutes);

const doctorRoutes = require("./routes/doctor");
app.use("/doctor", doctorRoutes);
