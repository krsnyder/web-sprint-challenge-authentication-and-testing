const bcrypt = require('bcryptjs');
const Users = require('../auth/auth-model');

async function validateNewUser(req, res, next) {
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

async function validateCredentials(req, res, next) {
  const user = await Users.getUserBy(req.body.username);

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.status(200).json({ message: 'Logged in' });
  } else {
    console.log(user);
    console.log(req.body);
    next({ message: 'Fail' });
  }
}

module.exports = {
  validateNewUser,
  validateCredentials,
};
