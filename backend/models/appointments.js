const mongoose = require("mongoose");
const appointmentsSchema = new mongoose.Schema({
    patientId: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    doctorId: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    date: Date,
    start: Date,
    status: String,
    end: Date,
    is_active: Number,
});
const appointmentModel = mongoose.model("appointments", appointmentsSchema);
module.exports = appointmentModel;
