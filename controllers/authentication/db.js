const pgp = require('pg-promise')();
const { auth } = require('../../config/db.config');

const authdb = pgp(`postgres://${auth.role}:${auth.password}@${auth.host}:${auth.port}/${auth.dbname}`);

module.exports = { authdb };
