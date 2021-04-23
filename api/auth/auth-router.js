const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./auth-model');
const { validateNewUser, validateCredentials } = require('../middleware/auth-middleware');

router.post('/register', validateNewUser, (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  const userInfo = {
    username,
    password: hash,
  };

  Users.addUser(userInfo)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.post('/login', validateCredentials, async (req, res) => {
  const user = req.body;
  const token = buildToken(user);
  res.status(200).json({ message: `welcome, ${user.username}`, token });

  function buildToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
    };
    const config = {
      expiresIn: '30m',
    };
    return jwt.sign(payload, process.env.JWT_SECRET, config);
  }

  /*
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
  */
});

module.exports = router;
