const { dataDB } = require('./db');

const { ParameterizedQuery } = require('pg-promise');

function getAllCounterparties(req, res) {
  const query = new ParameterizedQuery(
    {
      text: `SELECT * FROM counterparties.counterparties;`,
    },
  );
  dataDB.any(query)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error)
      res.send({ error });
    });
};

module.exports = {
  getAllCounterparties
};
