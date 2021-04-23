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
  const databaseUser = await Users.getUserBy(req.body.username);
  const { username, password } = req.body;
  if (!username || !password) {
    next({ status: 400, message: 'username and password required' });
  } else if (databaseUser && bcrypt.compareSync(req.body.password, databaseUser.password)) {
    req.body.id = databaseUser.id;
    next();
  } else {
    next({ message: 'invalid credentials' });
  }
}

module.exports = {
  validateNewUser,
  validateCredentials,
};
