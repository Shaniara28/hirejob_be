const { selectAllWorker, selectWorker, updateWorker, deleteWorker, countData, findId, registerWorker, findEmail, selectAllValueWorker } = require('../model/worker');
const commonHelper = require('../helper/common');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/auth');
const jwt = require('jsonwebtoken');

const workerController = {
  getAllWorker: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 4;
      const offset = (page - 1) * limit;
      let sortBY = req.query.sortBY || 'id_worker';
      let sort = req.query.sort || 'asc';
      console.log(sortBY);
      console.log(sort);
      let searchParam = req.query.search || '';
      const result = await selectAllWorker(limit, offset, searchParam, sortBY, sort);

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

  getDetailWorker: async (req, res) => {
    const id = req.params.id;
    const { rowCount } = await findId(id);
    if (!rowCount) {
      return res.json({ message: 'ID is Not Found' });
    }
    selectWorker(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'get data success');
      })
      .catch((err) => res.send(err));
  },

  getAllValueWorker: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { rowCount } = await findId(id);
    if (!rowCount) {
      return res.json({ message: 'ID is Not Found' });
    }
    selectAllValueWorker(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'get data success');
      })
      .catch((err) => res.send(err));
  },

  updateWorker: async (req, res) => {
    const id = req.params.id;
    const { name, phone, email, password, workplace, jobdesk, address, description, role } = req.body;
    const { rowCount } = await findId(id);

    if (!rowCount) return res.json({ message: 'Worker Not Found!' });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const data = {
      id,
      name,
      phone,
      email,
      password: passwordHash,
      workplace,
      jobdesk,
      address,
      description,
      role: 'worker',
    };

    updateWorker(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data Worker Updated!');
      })
      .catch((error) => {
        res.send(error);
      });
  },

  deleteWorker: async (req, res) => {
    try {
      const id = req.params.id;
      const { rowCount } = await findId(id);
      const role = req.payload.id;

      if (role !== id) return res.json({ message: 'Permission denied, token not match' });

      if (!rowCount) {
        return res.json({ message: 'ID is Not Found' });
      }
      deleteWorker(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Worker deleted'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  registerWorker: async (req, res) => {
    const { name, phone, email, password, workplace, jobdesk, address, description, role } = req.body;
    const { rowCount } = await findEmail(email);

    if (rowCount) return res.json({ message: 'Email already exist!' });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const id = uuidv4();

    const data = {
      id,
      name,
      phone,
      email,
      password: passwordHash,
      workplace,
      jobdesk,
      address,
      description,
      role: 'worker',
    };

    registerWorker(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data Worker Created');
      })
      .catch((error) => {
        res.send(error);
      });
  },

  loginWorker: async (req, res) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [worker],
      } = await findEmail(email);

      if (!worker) return res.json({ message: 'Email Not Register!' });

      const validatePassword = bcrypt.compareSync(password, worker.password);
      if (!validatePassword) return res.json({ message: 'Password Incorect' });

      delete worker.password;

      let payload = {
        email: worker.email,
        role: worker.role,
        id: worker.id_worker,
      };

      worker.token = authHelper.generateToken(payload);
      worker.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, worker, 201, 'Login Successfull');
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
      };

      const result = {
        token: authHelper.generateToken(payload),
        refreshToken: authHelper.generateRefreshToken(payload),
      };

      commonHelper.response(res, result, 200, 'Refresh Token Success');
    } catch (error) {
      console.log(error);
    }
  },

  profileWorker: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [worker],
    } = await findEmail(email);
    const role = req.payload.role;

    if (role !== 'worker') return res.json({ message: `Permission Denied, cannot get worker!` });

    delete worker.password;

    commonHelper.response(res, worker, 200);
  },
};

module.exports = workerController;
