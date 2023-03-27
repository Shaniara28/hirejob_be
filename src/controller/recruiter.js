const { selectAllRecruiter, selectRecruiter, updateRecruiter, deleteRecruiter, countData, findId, registerRecruiter, findEmail } = require('../model/recruiter');
const commonHelper = require('../helper/common');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/auth');
const jwt = require('jsonwebtoken');

const recruiterController = {
  getAllRecruiter: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      let sortBY = req.query.sortBY || 'fullname';
      let sort = req.query.sort || 'ASC';
      let searchParam = req.query.search || '';
      const result = await selectAllRecruiter(limit, offset, searchParam, sortBY, sort);

      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, 'get data success', pagination);
    } catch (error) {
      console.log(error);
    }
  },

  getDetailRecruiter: async (req, res) => {
    const id = req.params.id;
    const { rowCount } = await findId(id);
    if (!rowCount) {
      return res.json({ message: 'ID is Not Found' });
    }
    selectRecruiter(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'get data success');
      })
      .catch((err) => res.send(err));
  },

  updateRecruiter: async (req, res) => {
    const id = req.params.id;
    const photo = req.file.filename;
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || 'localhost';

    const { name, phone, email, password, position, job_field, city, description, instagram, linkedin, company_name } = req.body;

    const { rowCount } = await findId(id);

    if (!rowCount) return res.json({ message: 'Recruiter Not Found!' });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const data = {
      id,
      name,
      email,
      phone,
      position,
      password: passwordHash,
      job_field,
      city,
      description,
      instagram,
      linkedin,
      company_name,
    };

    updateRecruiter(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data Recruiter Updated!');
      })
      .catch((error) => {
        res.send(error);
      });
  },

  deleteRecruiter: async (req, res) => {
    try {
      const id = req.params.id;
      const { rowCount } = await findId(id);
      const role = req.payload.id;
      console.log(role);

      if (role !== id) return res.json({ message: 'Permission denied, token not match' });

      if (!rowCount) {
        return res.json({ message: 'ID is Not Found' });
      }
      deleteRecruiter(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Recruiter deleted'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  registerRecruiter: async (req, res) => {
    const { name, email, password, company_name, position, phone, job_field, city, description, instagram, linkedin, role } = req.body;

    const { rowCount } = await findEmail(email);

    if (rowCount) return res.json({ message: 'Email already exist!' });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const id = uuidv4();

    const data = {
      id,
      name,
      email,
      password: passwordHash,
      company_name,
      position,
      phone,
      job_field,
      city,
      description,
      instagram,
      linkedin,
      role: 'recruiter',
    };

    registerRecruiter(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data Recruiter Created');
      })
      .catch((error) => {
        res.send(error);
      });
  },

  loginRecruiter: async (req, res) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [recruiter],
      } = await findEmail(email);

      if (!recruiter) return res.json({ message: 'Email Not Register!' });

      const validatePassword = bcrypt.compareSync(password, recruiter.password);
      if (!validatePassword) return res.json({ message: 'Password Incorect' });

      delete recruiter.description;
      delete recruiter.password;

      let payload = {
        email: recruiter.email,
        role: recruiter.role,
        id: recruiter.id_recruiter,
      };

      recruiter.token = authHelper.generateToken(payload);
      recruiter.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, recruiter, 201, 'Login Successfull');
    } catch (error) {
      console.log(error);
    }
  },

  refreshToken: (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      let decode = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);

      const payload = {
        email: decode.email,
        role: decode.role,
        id: decode.id_recruiter,
      };

      const result = {
        token: authHelper.generateToken(payload),
        refreshToken: authHelper.generateRefreshToken(payload),
      };

      commonHelper.response(res, result, 200);
    } catch (error) {
      console.log(error);
    }
  },

  profileRecruiter: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [recruiter],
    } = await findEmail(email);
    const role = req.payload.role;

    if (role !== 'recruiter') return res.json({ message: `Permission Denied, cannot get recruiter!` });

    delete recruiter.password;

    commonHelper.response(res, recruiter, 200);
  },
};

module.exports = recruiterController;
