const { selectAllPortfolio, selectPortfolio, countData, showPortfolioByUserId, insertPortfolio, findId, findName, deletePortfolio, updatePortfolio } = require('../model/portofolio');

const commonHelper = require('../helper/common');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/auth');
const jwt = require('jsonwebtoken');
const { uploadPhotoCloudinary } = require('../../cloudinary.config');

const portfolioController = {
  getAllPortfolio: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      let sortBY = req.query.sortBY || 'id_worker';
      let sort = req.query.sort || 'ASC';
      let searchParam = req.query.search || '';
      const result = await selectAllPortfolio(limit, offset, searchParam, sortBY, sort);

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

  getPortfolioUser: async (req, res) => {
    try {
      //Get request user id
      const id_worker = req.params.id;
      console.log(id_worker);

      // Check if user already liked recipe
      const result = await showPortfolioByUserId(id_worker);
      if (!result.rowCount) return commonHelper.response(res, null, 202, "Worker doesn't have any portofolio");

      //Response
      commonHelper.response(res, result.rows, 200, 'Get user portfolio successful');
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, 'Failed getting user portfolio');
    }
  },

  getDetailPortfolio: async (req, res) => {
    const id = req.params.id;
    const { rowCount } = await findId(id);
    if (!rowCount) {
      return res.json({ message: 'ID is Not Found' });
    }
    selectPortfolio(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'get data success');
      })
      .catch((err) => res.send(err));
  },

  updatePortfolio: async (req, res) => {
    const id = req.params.id;
    const id_worker = req.payload.id;

    const photo = req.file.filename;
    const upload = await uploadPhotoCloudinary(req.file.path);

    const { name, repo, type } = req.body;

    const { rowCount } = await findId(id);
    if (!rowCount) return res.json({ message: 'Portfolio not exist!' });

    const data = {
      id,
      name,
      repo,
      type,
      photo: upload.secure_url,
      id_worker,
    };
    updatePortfolio(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data portfolio Updated!');
      })
      .catch((error) => {
        res.send(error);
      });
  },

  deletePortfolio: async (req, res) => {
    try {
      const id = req.params.id;
      const id_worker = req.payload.id;
      const { rowCount } = await findId(id);

      if (!rowCount) {
        return res.json({ message: 'Portfolio not Found' });
      }
      deletePortfolio(id, id_worker)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Portfolio deleted'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  inputPortfolio: async (req, res) => {
    const id_worker = req.params.id;
    const id = uuidv4();

    const { name, type, repository } = req.body;
    const upload = await uploadPhotoCloudinary(req.file.path);

    const { rowCount } = await findName(name, id_worker);

    if (rowCount) return res.json({ message: 'Portfolio already exist!' });

    const data = {
      id,
      id_worker,
      name,
      type,
      repository,
      photo: upload.secure_url,
    };

    console.log(data);

    insertPortfolio(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data Portfolio Created');
      })
      .catch((error) => {
        res.send(error);
      });
  },
};

module.exports = portfolioController;
