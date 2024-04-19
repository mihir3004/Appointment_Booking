const mongoose = require("mongoose");
const appointmentsSchema = new mongoose.Schema({
    patientId: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    doctorId: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    date: Date,
    start: Date,
    status: String,
    end: Date,
});
const appointmentModel = mongoose.model("appointments", appointmentsSchema);
module.exports = appointmentModel;
