const bcrypt = require("bcryptjs");
const db = require("../services/dbService");
const jwt = require("jsonwebtoken");

//REGISTER_
function register(req, res) {
  const { name, email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  const result = db.createUser(name, email, hash);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({
    message: "Account created successfully",
    accountNumber: result.accountNumber
  });
}

module.exports = { register };


//LOGIN_
function login(req, res) {
  const { email, password } = req.body;

  const user = db.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      error: "User not found"
    });
  }

  const validPassword = bcrypt.compareSync(
    password,
    user.password
  );

  if (!validPassword) {
    return res.status(401).json({
      error: "Invalid password"
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h"
    }
  );

  res.json({
    message: "Login successful",
    token
  });
}


module.exports = {
  register,
  login
};
