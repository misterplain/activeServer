const User = require("../../models/bcnMinimalista/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roundToNearestMinutesWithOptions } = require("date-fns/fp");

let refreshTokens = [];

// @desc    Auth user & get token
// @route   POST /login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "Login failed, please check your credentials" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match)
    return res
      .status(401)
      .json({ message: "Login failed, please check your credentials" });

  const accessToken = jwt.sign(
    {
      id: foundUser._id,
      email: foundUser.email,
    },
    process.env.ACCESS_TOKEN_SECRET_BCN,
    { expiresIn: "7d" }
  );

  const refreshToken = jwt.sign(
    { email: foundUser.email, id: foundUser._id },
    process.env.REFRESH_TOKEN_SECRET_BCN,
    { expiresIn: "30d" }
  );

  refreshTokens.push(refreshToken);
  console.log({
    refreshTokens: refreshTokens,
    text: "refresh token array after login",
  });

  // Send accessToken containing username and roles
  res.json({ foundUser, accessToken, refreshToken });
});

// @desc Refresh
// @route GET /users/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  let refreshToken = req.get("Authorization");
  refreshToken = refreshToken.slice(refreshToken.indexOf(" ") + 1);

  if (!refreshTokens.includes(refreshToken)) {
    return res
      .status(403)
      .json({ message: "Refresh token not part of array " });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_BCN,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden " + err });
      err && console.log(err);
      console.log(refreshTokens);
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = jwt.sign(
        {
          email: decoded.email,
          id: decoded.id,
        },
        process.env.ACCESS_TOKEN_SECRET_BCN,
        { expiresIn: "60s" }
      );

      const newRefreshToken = jwt.sign(
        {
          email: decoded.email,
          id: decoded.id,
        },
        process.env.REFRESH_TOKEN_SECRET_BCN,
        { expiresIn: "30d" }
      );

      refreshTokens.push(newRefreshToken);

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      console.log({
        refreshTokens: refreshTokens,
        text: "refresh token array after refresh",
      });

      console.log({
        newAccessToken: newAccessToken,
        newRefreshToken: newRefreshToken,
      });
    }
  );
};

const logout = (req, res) => {
  let refreshToken = req.get("Authorization");
  refreshToken = refreshToken.slice(refreshToken.indexOf(" ") + 1);
  // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  console.log({
    refreshTokens: refreshTokens,
    text: "refresh token array after logout",
  });
  res.status(200).json("You logged out successfully.");
};

module.exports = { authUser, refresh, logout };
