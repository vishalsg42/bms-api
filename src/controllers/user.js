const sequelize = require('../config/dbConfig').default;
const errorMsg = require('../helpers/errorMessage').errorMessages;
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const utils = require('../helpers/utils');
const jwt = require('jsonwebtoken');
const authService = require('../services/authServices');

const {
  statusCodes: {
    fiveHundred,
    twoNotOne,
    fourHundred,
    fourNotThree
  }
} = utils;

const {
  logger: {
    errorLog
  }
} = require('../../logger');

/**
 * RegisterUser
 * @param {Object} req request object
 * @param {Object} res response object
 */
exports.registerUser = async (req, res) => {
  try {

    if (!utils.checkIfDataExists(req.body)) {
      return res.status(400).send(utils.responseMsg(errorMsg.noPostDataProvided));
    }

    let {
      first_name,
      last_name,
      email,
      password,
      ph_number,
      primary_address,
      state,
      city,
      zipcode,
      country
    } = req.body;


    const schema = Joi.object({
      first_name: Joi.string().error(new Error('Invalid first Name')),
      last_name: Joi.string().error(new Error('Invalid last name')),
      email: Joi.string().email().required().error(new Error('Invalid email id')),
      password: Joi.string().required().error(new Error('Invalid password value')),
      ph_number: Joi.string().error(new Error('Invalid phone number')),
      primary_address: Joi.string().error(new Error('Invalid primary address')),
      city: Joi.string().error(new Error('Invalid city')),
      zipcode: Joi.string().error(new Error('Invalid zipcode')),
      state: Joi.string().error(new Error('Invalid state')),
      country: Joi.string().error(new Error('Invalid country')),
    });

    const result = schema.validate({
      first_name,
      last_name,
      email,
      password,
      ph_number,
      primary_address,
      state,
      city,
      zipcode,
      country
    });

    if (result.error) {
      return res.status(400).send(utils.responseMsg(errorMsg.invalidDataProvided(result.error.message)));
    }

    let user = await sequelize.user.findOne({
      'where': {
        'email': {
          '$like': `%${email}%`
        }
      }
    });

    if (utils.checkIfDataExists(user)) {
      return res.status(fourHundred).send(utils.responseMsg(errorMsg.userExists));
    }

    await sequelize.user.create({
      first_name,
      last_name,
      email,
      password,
      ph_number,
      primary_address,
      state,
      city,
      zipcode,
      country
    });

    res.status(twoNotOne).send(utils.responseMsg(null, true, 'Successfully registered user!'));
  } catch (error) {
    errorLog.error(error);
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};

/**
 * login
 * @param {Object} req request object
 * @param {Object} res response object
 */
exports.login = async (req, res) => {
  try {

    if (!utils.checkIfDataExists(req.body)) {
      return res.status(400).send(utils.responseMsg(errorMsg.noPostDataProvided));
    }

    let {
      email,
      password,
    } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required().error(new Error('Invalid email id')),
      password: Joi.string().required().error(new Error('Invalid password')),
    });

    const result = schema.validate({
      email,
      password,
    });

    if (result.error) {
      return res.status(400).send(utils.responseMsg(errorMsg.invalidDataProvided(result.error.message)));
    }

    const userDetails = await sequelize
      .user
      .findOne({
        'where': {
          email
        }
      });

    if (!utils.checkIfDataExists(userDetails)) {
      return res.status(twoNotOne).send(utils.responseMsg(errorMsg.userNotFound));
    }

    if (!bcrypt.compareSync(password.trim(), userDetails.password)) {
      return res.status(fourNotThree).send(utils.responseMsg(errorMsg.invalidEmailOrPassword));
    }

    res.send(utils.responseMsg(null, true, {
      email,
      id: userDetails.id,
      'token': authService.createToken({ email }),
    }));


  } catch (error) {
    errorLog.error(error);
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};

/**
 * signToken
 * @param {String} user user id
 * @param {String} secretKey App Secret Token
 */
exports.signToken = (user, secretKey = process.env.JWT_SECRET) => {
  return jwt.sign(user, secretKey, { expiresIn: `${process.env.JWT_EXPIRE_IN}` });
};
