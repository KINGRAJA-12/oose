import cloudinary from "../lib/cloudinary.js";
import Attendance from "../models/Attendance.model.js";
import User from "../models/User.model.js";
export const addEmployee = async (req, res, next) => {
  try {
    let { email, password, salary, image, gender } = req.body;
    if (!email || !password || !salary || !image) return res.status(400).json({ message: "All fields are required." });
    let user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "User already exists." });
    let year = new Date().getFullYear();
    let genderReg = gender === 'M' ? 'M' : 'G';
    let month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    let emailFirst3 = email.slice(0, 3).toLowerCase();
    let randomNum = Math.floor(1000 + Math.random() * 9000);
    let name = `E${year}${genderReg}${month}${emailFirst3}${randomNum}`;
    if (!name) return res.status(400).json({ message: "Failed to create employee." });
    let result = await cloudinary.uploader.upload(image);
    let imageUrl = result?.secure_url;
    await User.create({ name, email, password, salary, gender, image: imageUrl });
    return res.status(200).json({ message: "Employee created successfully." });
  } catch (err) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const viewEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Employee not found." });

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, salary, image, gender } = req.body;
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Employee not found." });
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (salary) user.salary = salary;
    if (gender) user.gender = gender;

    if (image) {
      let result = await cloudinary.uploader.upload(image);
      user.image = result?.secure_url;
    }

    await user.save();
    return res.status(200).json({ message: "Employee updated successfully." });
  } catch (err) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id)
    return res.status(200).json({ message: "Employee deleted successfully." });
  } catch (err) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const getAllEmployee = async (req, res, next) => {
  try {
    console.log("this is called")
    let users = await User.find({ _id: { $ne: req?.user?._id } });
    return res.status(200).json(users);
  } catch (err) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const isEligibleToTakeAttendance = async (req, res) => {
  try {
    const { cDate, cYear, cMonth } = req.params;

    const now = new Date();
    const hours = now.getHours();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const existing = await Attendance.findOne({ date: cDate, year: cYear, month: cMonth });
    if(existing&&existing.isSubmitted){
      return res.status(400).json({message:"attendance already token for today"})
    }
    if (existing&&!existing.isSubmitted) {
      return res.status(200).json({ message: "Attendance already taken for today." });
    }

    if (hours >= 9) {
      await Attendance.create({ date, month, year, day: "duty" });
      return res.status(200).json({ message: true });
    }

    return res.status(200).json({ message: false });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const submitAttendance = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: "Required attendance data is missing or invalid." });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const attendance = await Attendance.findOne({ year, month, date });

    if (!attendance) {
      return res.status(400).json({ message: "Attendance sheet not created yet for today." });
    }

    attendance.attendance = data;
    attendance.isSubmitted = true;
    await attendance.save();

    return res.status(200).json({ message: "Attendance stored successfully." });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const setHoliday=async(req,res,next)=>{
  try{
    let now=new Date();
    let date=now.getDate();
    let month=now.getMonth();
    let year=now.getFullYear();
    let attendance=await Attendance.findOne({date,month,year});
    if(attendance){
      return res.status(400).json({message:"attendance already taken"});
    }
    await Attendance.create({date,month,year,day:"Holiday"});
    return res.status(200).json({message:"set as holiday sucesfully"});
  }catch(err){
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
}

