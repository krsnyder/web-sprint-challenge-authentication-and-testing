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
  const { username, password } = req.body;
  res.status(200).json({ message: 'Logged in' });
  /*

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
