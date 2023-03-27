const Pool = require('../config/db');

const selectAllSkills = (limit, offset, searchParam, sortBY, sort) => {
  return Pool.query(`SELECT * FROM skills WHERE name LIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset} `);
};

const showSkillByUserId = (id) => {
  return Pool.query(`SELECT * FROM skills WHERE id_worker = '${id}'`);
};

const selectSkills = (id) => {
  return Pool.query(`SELECT * FROM skills WHERE id_skill='${id}'`);
};

const insertSkills = (data) => {
  const { id, name, id_worker } = data;
  return Pool.query(`INSERT INTO skills (id_skill,name,id_worker) VALUES('${id}','${name}','${id_worker}')`);
};

const updateSkills = (data) => {
  const { id, name, id_worker } = data;
  return Pool.query(`UPDATE skills SET name='${name}' WHERE id_worker='${id_worker}' and id_skill='${id}'`);
};

const deleteSkills = (id, id_worker) => {
  return Pool.query(`DELETE FROM skills WHERE id_skill='${id}' and id_worker='${id_worker}'`);
};

const countData = () => {
  return Pool.query('SELECT COUNT(*) FROM skills');
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id_skill FROM skills WHERE id_skill='${id}'`, (error, result) => {
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
    Pool.query(`SELECT name FROM skills where id_worker='${id_worker}' and name ILIKE '%${name}%'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

module.exports = {
  selectAllSkills,
  showSkillByUserId,
  findName,
  selectSkills,
  insertSkills,
  updateSkills,
  deleteSkills,
  countData,
  findId,
};
