const Pool = require('../config/db');

const selectAllRecruiter = (limit, offset, searchParam, sortBY, sort) => {
  return Pool.query(`SELECT * FROM recruiters WHERE fullname LIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset} `);
};

const selectRecruiter = (id) => {
  return Pool.query(`SELECT * FROM recruiters WHERE id_recruiter='${id}'`);
};

// const insertRecruiter = (data) =>{
//     const { id,name,phone,email,password,dob, role} = data;
//     return Pool.query(`INSERT INTO recruiters(id_recruiter,fullname,email,company_name,position,phone,job_field,city,description_company, instagram,linkedin, password) VALUES(${id},'${name}','${email}','${company_name}','${position}','${phone}','${job_field}','${city}','${description}','${instagram}','${linkedin}','${password}')`);
// }

const updateRecruiter = (data) => {
  const { id, name, phone, email, password, position, job_field, city, description, instagram, linkedin, company_name } = data;
  return Pool.query(
    `UPDATE recruiters SET fullname='${name}',email='${email}',company_name='${company_name}',position='${position}',phone='${phone}',job_field='${job_field}',city='${city}',description_company='${description}', instagram='${instagram}',linkedin='${linkedin}', password='${password}' WHERE id_recruiter='${id}'`
  );
};

const deleteRecruiter = (id) => {
  return Pool.query(`DELETE FROM recruiters WHERE id_recruiter='${id}'`);
};

const countData = () => {
  return Pool.query('SELECT COUNT(*) FROM recruiters');
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id_recruiter FROM recruiters WHERE id_recruiter='${id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

// AUTHENTICATION

const registerRecruiter = (data) => {
  const { id, name, email, password, company_name, position, phone, job_field, city, description, instagram, linkedin, role } = data;

  return Pool.query(
    `INSERT INTO recruiters(id_recruiter,fullname,email,password,company_name,position,phone,job_field,city,description_company, instagram,linkedin, role) VALUES('${id}','${name}','${email}','${password}','${company_name}','${position}','${phone}','${job_field}','${city}','${description}','${instagram}','${linkedin}','${role}')`
  );
};

const findEmail = (email) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM recruiters WHERE email='${email}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

module.exports = {
  selectAllRecruiter,
  selectRecruiter,
  // insertRecruiter,
  updateRecruiter,
  deleteRecruiter,
  countData,
  findId,
  registerRecruiter,
  findEmail,
};
