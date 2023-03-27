const {
  selectAllExperience,
  selectExperience,
  countData,
  showExperienceByUserId,
  insertExperience,
  findId,
  // findName,
  deleteExperience,
  updateExperience,
} = require('../model/experience');

const commonHelper = require('../helper/common');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/auth');
const jwt = require('jsonwebtoken');
const { uploadPhotoCloudinary } = require('../../cloudinary.config');

const experienceController = {
  getAllExperience: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      let sortBY = req.query.sortBY || 'id_worker';
      let sort = req.query.sort || 'ASC';
      let searchParam = req.query.search || '';
      const result = await selectAllExperience(limit, offset, searchParam, sortBY, sort);

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

  getExperienceUser: async (req, res) => {
    try {
      //Get request user id
      const id_worker = req.params.id;
      console.log(id_worker);

      // Check if user already liked recipe
      const result = await showExperienceByUserId(id_worker);
      if (!result.rowCount) return commonHelper.response(res, null, 202, 'No one portfolio in this user');

      //Response
      commonHelper.response(res, result.rows, 200, 'Get user porfolio successful');
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, 'Failed getting user portfolio');
    }
  },

  getDetailExperience: async (req, res) => {
    const id = req.params.id;
    const { rowCount } = await findId(id);
    if (!rowCount) {
      return res.json({ message: 'experience is Not Found' });
    }
    selectExperience(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'get data success');
      })
      .catch((err) => res.send(err));
  },

  updateExperience: async (req, res) => {
    const id = req.params.id;
    const id_worker = req.payload.id;

    const photo = req.file.filename;
    const upload = await uploadPhotoCloudinary(req.file.path);

    const { company_name, startdate, enddate, jobdesk, description } = req.body;

    const { rowCount } = await findId(id);
    if (!rowCount) return res.json({ message: 'Experience not exist!' });

    const data = {
      id,
      id_worker,
      company_name,
      jobdesk,
      startdate,
      enddate,
      description,
      photo: upload.secure_url,
    };
    updateExperience(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data experience Updated!');
      })
      .catch((error) => {
        res.send(error);
      });
  },

  deleteExperience: async (req, res) => {
    try {
      const id = req.params.id;
      const id_worker = req.payload.id;
      const { rowCount } = await findId(id);

      if (!rowCount) {
        return res.json({ message: 'Experience not Found' });
      }
      deleteExperience(id, id_worker)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Experience deleted'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  inputExperience: async (req, res) => {
    const id_worker = req.params.id;
    const id = uuidv4();

    const upload = await uploadPhotoCloudinary(req.file.path);

    const { company_name, job_desk, date_start, date_end, description } = req.body;

    const data = {
      id,
      id_worker,
      company_name,
      job_desk,
      date_start,
      date_end,
      description,
      photo: upload.secure_url,
    };
    insertExperience(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, 'Data Experience Created');
      })
      .catch((error) => {
        res.send(error);
      });
  },
};

module.exports = experienceController;
