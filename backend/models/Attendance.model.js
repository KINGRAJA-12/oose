import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  day: {
    type: String,
    enum: ["duty", "Holiday"],
    default: "duty"
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  attendance: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        default: "Absent",
      }
    }
  ]
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
