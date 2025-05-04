import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Absent",
  },
}, { timestamps: true });

const Attendance = mongoose.model("attendance", attendanceSchema);
export default Attendance;
