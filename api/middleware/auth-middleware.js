const Users = require('../auth/auth-model');

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

module.exports = {
  validateCredentials,
};
