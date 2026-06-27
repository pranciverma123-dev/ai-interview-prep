

const jwt = require("jsonwebtoken");

 const secret = "pranci$@1233";

function setUser(user) {
  return jwt.sign(
    {
      uid: user._id.toString(),
      email: user.email,
      firstname: user.firstname,
    },
    secret,
    {
      expiresIn: "5h",
    }
  );
}

function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(
      token,
      secret
    );
  } catch (err) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};