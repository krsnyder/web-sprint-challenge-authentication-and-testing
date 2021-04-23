const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./auth-model');

async function validateCredentials(req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await Users.getUserBy(username);
    if (!username || !password) {
      res.status(400).json({ message: 'username and password required' });
    } else if (user) {
      res.status(400).json({ message: 'username taken' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

router.post('/register', validateCredentials, (req, res, next) => {
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

router.post('/login', (req, res) => {
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

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
