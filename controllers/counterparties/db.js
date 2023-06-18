const pgp = require('pg-promise')();
const { data } = require('../../config/db.config');
const { authdb } = require('../authentication/db');
const { getUserInfo } = require('../authentication/index');

console.log(getUserInfo())


const db = pgp(`postgres://${global.pguser}:${global.pgpass}@${data.host}:${data.port}/${data.dbname}`);

module.exports = { db };
