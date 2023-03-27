const Pool = require('../config/db');

const selectAllPortfolio = (limit, offset, searchParam, sortBY, sort) => {
  return Pool.query(`SELECT * FROM portfolio WHERE name LIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset} `);
};

const showPortfolioByUserId = (id_worker) => {
  return Pool.query(`SELECT * FROM portfolio WHERE id_worker = '${id_worker}'`);
};

const selectPortfolio = (id) => {
  return Pool.query(`SELECT * FROM portfolio WHERE id_portfolio='${id}'`);
};

const insertPortfolio = (data) => {
  const { id, name, id_worker, repo, type, photo } = data;
  return Pool.query(`INSERT INTO portfolio (id_portfolio,id_worker,name,repository,type, photo) VALUES('${id}','${id_worker}','${name}','${repo}','${type}','${photo}')`);
};

const updatePortfolio = (data) => {
  const { id, name, id_worker, repo, type, photo } = data;
  return Pool.query(`UPDATE portfolio SET name='${name}', repository='${repo}', type='${type}', photo='${photo}' WHERE id_worker='${id_worker}' and id_portfolio='${id}'`);
};

const deletePortfolio = (id, id_worker) => {
  return Pool.query(`DELETE FROM portfolio WHERE id_portfolio='${id}' and id_worker='${id_worker}'`);
};

const countData = () => {
  return Pool.query('SELECT COUNT(*) FROM portfolio');
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id_portfolio FROM portfolio WHERE id_portfolio='${id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findName = (name, id_worker) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT name FROM portfolio where id_worker='${id_worker}' and name ILIKE '%${name}%'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

module.exports = {
  selectAllPortfolio,
  showPortfolioByUserId,
  findName,
  selectPortfolio,
  insertPortfolio,
  updatePortfolio,
  deletePortfolio,
  countData,
  findId,
};
