import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
////import Token from "../models/token.model.js";
////import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } =
      req.body;

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
    //  email,
      username,
      password,
      confirmPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    generateToken(newUser._id, res);
    await newUser.save();
    // const key = Math.random().toString(36).slice(-8);
    // const hashedKey = bcrypt.hashSync(key, 10);

    // const token = new Token({
    //   _userId: newUser._id,
    //   token: hashedKey,
    // });

    // Email verification steps here
    //  await token.save();

    //  sendEmail(req, newUser.email, token);
    //  res.status(200).json("A verification link has been sent to your email");
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

// Email verification code
// export const confirmEmail = (req, res) => {
//   Token.findOne({ token: req.params.token }, function (err, token) {
//     // token is not found into database i.e. token may have expired
//     if (!token) {
//       return res
//         .status(400)
//         .send({
//           msg: "Your verification link may have expired. Please click on resend for verify your Email.",
//         });
//     }
//     // if token is found then check valid user
//     else {
//       User.findOne(
//         { _id: token._userId, email: req.params.email },
//         function (err, user) {
//           // not valid user
//           if (!user) {
//             return res
//               .status(401)
//               .send({
//                 msg: "We were unable to find a user for this verification. Please SignUp!",
//               });
//           }
//           // user is already verified
//           else if (user.isVerified) {
//             return res
//               .status(200)
//               .send("User has been already verified. Please Login");
//           }
//           // verify user
//           else {
//             // change isVerified to true
//             user.isVerified = true;
//             user.save(function (err) {
//               // error occur
//               if (err) {
//                 return res.status(500).send({ msg: err.message });
//               }
//               // account successfully verified
//               else {
//                 return res
//                   .status(200)
//                   .send("Your account has been successfully verified");
//               }
//             });
//           }
//         }
//       );
//     }
//   });
// };

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

    // if (!user.isVerified) {
    //   return res.status(401).json({
    //     error: "Your email is not verified",
    //   });
    // }

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
