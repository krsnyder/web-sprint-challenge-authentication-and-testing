const db = require('../../data/dbConfig');

function getUserBy(filter) {
  return db('users').where({ filter }).first();
}

async function addUser(newUser) {
  const user = await db('users').insert(newUser)
    .then(([id]) => db('users').where({ id }).first());
  return user;
}

module.exports = {
  getUserBy,
  addUser,
};
