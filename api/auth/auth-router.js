const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');
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

  function buildToken(info) {
    const payload = {
      subject: info.id,
      username: info.username,
    };
    const config = {
      expiresIn: '30m',
    };
    return jwt.sign(payload, jwtSecret, config);
  }
});

module.exports = router;
