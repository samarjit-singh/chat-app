const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already exist", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userName = await User.findOne({ username });
    if (!userName)
      return res.json({ msg: "Incorrect username or password", status: false });

    const isPasswordValid = await bcrypt.compare(password, userName.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect username or password", status: false });

    delete userName.password;

    return res.json({ status: true, userName });
  } catch (error) {
    next(error);
  }
};
