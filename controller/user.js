const User = require("../models/user");
const bcrypt = require("bcrypt");
const { setUser } = require("../services/auth");
const redisClient = require("../config/redis");




async function handleusersignup(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Signup Failed",
    });
  }
}


async function handleuserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
}


async function handleuserLogout(req, res) {
  try {
    res.clearCookie("uid");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Logout Failed",
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await redisClient.set(email, otp, {
      EX: 300,
    });

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otp, 
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Forgot Password Failed",
    });
  }
}


async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    const storedOTP =
      await redisClient.get(email);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
}



async function resetPassword(req, res) {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    const storedOTP =
      await redisClient.get(email);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    await redisClient.del(email);

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message:
        "Password reset failed",
    });
  }
}



async function getAllUsers(
  req,
  res
) {
  try {
    const users =
      await User.find().select(
        "-password"
      );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch users",
    });
  }
}


async function getUserById(
  req,
  res
) {
  try {
    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch user",
    });
  }
}
async function getProfile(req, res) {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
}
module.exports = {
  handleusersignup,
  handleuserLogin,
  handleuserLogout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getAllUsers,
  getUserById,
  getProfile
};