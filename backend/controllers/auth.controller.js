import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Password does not match",
      });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        error: "User already exist",
      });
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const validPassword = await bcrypt.compare(password, user?.password || "");

    if (!validPassword || !user) {
      return res.status(400).json({
        error: "Invalid user or password ",
      });
    }

    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullname: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
