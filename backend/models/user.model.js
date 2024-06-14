import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      //  minlength: 6,
    },
    confirmPassword: {
      type: String,
      required: true,
      //  minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // createdAt, updatedAt => Member since <createdAt>
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  console.log("just before saving...");
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
