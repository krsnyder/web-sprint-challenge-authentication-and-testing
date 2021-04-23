const bcrypt = require('bcryptjs');
const Users = require('../auth/auth-model');

async function validateNewUser(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'username and password required' });
  } else {
    const user = await Users.getUserBy(username);
    if (user) {
      res.status(400).json({ message: 'username taken' });
    } else {
      next();
    }
  }
}

async function validateCredentials(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({ status: 400, message: 'username and password required' });
  } else {
    const databaseUser = await Users.getUserBy(req.body.username);
    if (databaseUser && bcrypt.compareSync(req.body.password, databaseUser.password)) {
      req.body.id = databaseUser.id;
      next();
    } else {
      next({ message: 'invalid credentials' });
    }
  }
}

module.exports = {
  validateNewUser,
  validateCredentials,
};
