const db = require('../../data/dbConfig');

function getUserBy(filter) {
  return db('users').where({ filter }).first();
}

module.exports = {
  getUserBy,
};
