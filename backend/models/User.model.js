import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      required: true,
      default: "employee",
    },
    requestToReset:{
      type:Boolean,
      default:false
    }

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.compare = async function (password) {
  return await bcrypt.compare(password, this.password);
};

let User = mongoose.model("user", userSchema);
export default User;