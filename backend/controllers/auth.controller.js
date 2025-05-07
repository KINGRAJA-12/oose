import Attendance from "../models/Attendance.model.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
 import dotenv from "dotenv"
 dotenv.config()
 var transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: 
    "smtp@mailtrap.io",
    pass:"d0ba603cb79b82f7ba263e74d8806f3c"
  }
});


const TOKEN = "d0ba603cb79b82f7ba263e74d8806f3c";


export const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)return res.status(400).json({ message: "Credential missing bro" });
    const user = await User.findOne({ name: username });
    if (!user)
      return res.status(400).json({ message: "No such user is found" });
    const isMatch = await user.compare(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.SECRETE_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const alreadyMarked = await Attendance.findOne({
    //   user: user._id,
    //   date: { $gte: today },
    // });
    // if (!alreadyMarked) {
    //   await Attendance.create({
    //     user: user._id,
    //     date: new Date(),
    //     status: "Present",
    //   });
    // }
    return res.status(200).json({
      message: "Login successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout=async(req,res)=>{
  try{
    res.clearCookie("jwt");
    return res.status(200).json({message:"Logout sucessfully"})
  }catch(err){
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found with this email" });

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const sender = {
      address: "hello@demomailtrap.com",
      name: "Mailtrap Test",
    };
    await transport.sendMail({
       from:"hello@demomailtrap.com",
      to: [email],
      subject: "Reset your password",
      html: `
        <p>You requested to reset your password.</p>
        <p>Click <a href="${resetURL}">here</a> to reset your password. This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    user.requestToReset = true;
    await user.save();

    return res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Forget Password Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Token or new password missing" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findOne({ _id: payload.id });
    if (!user || !user.requestToReset)
      return res.status(404).json({ message: "User not found or reset not requested" });

    user.password = newPassword;
    user.requestToReset = false;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const forgetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is missing" });
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });
//     const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     await transport.sendMail({
//       to: email,
//       subject: "Password Reset Request",
//       html: `
//         <p>You requested a password reset.</p>
//         <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
//         <p>If you did not request this, please ignore this email.</p>
//       `
//     });
//     user.requestToReset=true
//     await user.save()

//     return res.status(200).json({ message: "Password reset link sent to your email." });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     if (!token || !newPassword)
//       return res.status(400).json({ message: 'Token or new password missing' });
//     let payload;
//     try {
//       payload = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     const user = await User.findOne({ _id: payload.id, email: payload.email });
//     if (!user|| !user.requestToReset) return res.status(404).json({ message: 'User not found' });

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.requestToReset=false
//     await user.save();

//     return res.status(200).json({ message: 'Password reset successfully' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };