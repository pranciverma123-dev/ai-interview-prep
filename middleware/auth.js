// const { getUser } = require("../services/auth");

// function protect(req, res, next) {
//   try {
//     const authHeader =
//       req.headers.authorization;

//     const token =
//       authHeader?.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : req.cookies?.uid;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token missing",
//       });
//     }

//     const user = getUser(token);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized",
//     });
//   }
// }

// module.exports = {
//   protect,
// };
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {getUser} =require("../services/auth");
const secret = "pranci$@1233";



async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.uid;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = getUser(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.uid);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { protect };