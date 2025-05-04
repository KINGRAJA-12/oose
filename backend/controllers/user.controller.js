import Attendance from "../models/Attendance.model.js";

export const getTotalPresentDays = async (req, res) => {
    try {
      const { userId } = req.params;
      const presentCount = await Attendance.countDocuments({
        user: userId,
        status: "Present",
      });
      console.log(presentCount)
      return res.status(200).json({ totalPresentDays: presentCount });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getMonthlySummary = async (req, res) => {
    try {
      const { userId } = req.params;
      const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const records = await Attendance.find({
        user: userId,
        date: { $gte: start, $lte: end },
      });
      return res.status(200).json({
        totalDays: records.length,
        details: records,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  