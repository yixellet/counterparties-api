const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ParameterizedQuery: PQ} = require('pg-promise');

const { authdb } = require('./db.js');

const { jwt_secret } = require('../../config/jwt.config.js');

function passwordValidation(password) {
  const regex = /[A-Za-z0-9]{8,}/;
  return regex.test(password);
}

module.exports.createUser = (req, res) => {
  const { login, email, pg_password } = req.body;

  if (passwordValidation(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        const query = new PQ(
          {
            text: 'INSERT INTO roles (login, password, email, pg_password) VALUES ($1, $2, $3, $4) RETURNING login, email;',
            values: [login, hash, email, pg_password]
          }
        );
        authdb.one(query)
          .then((data) => {
            res.status(201).send({ data });
          })
          .catch((error) => {
            if (error.code === '23505') {
              res.status(409).send({ message: 'User with that name already exists' })
            }
          });
      })
  } else {
    res.status(400).send({ message: 'Your password is shit.'})
  };
};

module.exports.login = (req, res) => {
  const {login, password} = req.body;

  const query = new PQ(
    {
      text: 'SELECT * FROM roles WHERE login = $1;',
      values: [login]
    }
  );
  authdb.one(query)
    .then((data) => {
      bcrypt.compare(password, data.password)
        .then((result) => {
          if (result) {
            console.log(data)
            global.pguser = data.login
            global.pgpass = data.pg_password
            const token = jwt.sign({ login: data.login }, jwt_secret, { expiresIn: '7d' });
            res.status(201).send({ jwt: token }).end();
          } else {
            res.status(401).send({ message: 'Invalid password' });
          }
        })
        .catch((err) => {
          res.status(401).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(401).send({ message: 'No user with name "' + login + '"' });
    });


};

module.exports.getUserInfo = () => {
  const query = new PQ(
    {
      text: 'SELECT * FROM roles WHERE login = $1;',
      values: [global.pguser]
    }
  );
  authdb.one(query)
    .then((data) => {
      return data
    })
}
