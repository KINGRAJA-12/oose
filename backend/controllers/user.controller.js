import Attendance from "../models/Attendance.model.js";

export const getTotalPresentDays = async (req, res) => {
    try {
      const { userId } = req.params;
      let now=new Date();
      let month=now.getMonth();
      let year=now.getFullYear();
      let attendanceRecords=await Attendance.find({month,year});
      let data=0;
      if(!attendanceRecords){
        return res.status(400).json({message:"No year found"});
      }
      let totalPresentDays=0;
       for (let record of attendanceRecords) {
        const found = record.attendance.find(
          (entry) => entry.user.toString() === userId && entry.status === "Present"
        );
        if (found) totalPresentDays++;
      }
      console.log("totalpresent",totalPresentDays)
      return res.status(200).json({ totalPresentDays: data });
    } catch (err) {
      console.error("err1",err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getMonthlySummary = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      const records = await Attendance.find({
        year: now.getFullYear(),
        month: now.getMonth(),
        date: { $gte: start.getDate(), $lte: end.getDate() }
      });
  
      const summary = records.map(record => {
        const userAttendance = record.attendance.find(
          (entry) => entry.user.toString() === userId
        );
        return {
          date: record.date,
          status: userAttendance ? userAttendance.status : "Absent"
        };
      });
      console.log(summary)
      let response={
        totalDays: summary.length,
        presentDays: summary.filter(d => d.status === "Present").length,
        absentDays: summary.filter(d => d.status === "Absent").length,
        details: summary,
      }
      console.log(response)
      return res.status(200).json(response);
    } catch (err) {
      console.error("err2",err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  