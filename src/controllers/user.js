const sequelize = require('../config/dbConfig').default;
const errorMsg = require('../helpers/errorMessage').errorMessages;
// const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const utils = require('../helpers/utils');

const {
  statusCodes: {
    fiveHundred,
    twoNotOne,
    fourHundred
  }
} = utils;

const {
  logger: {
    errorLog
  }
} = require('../../logger');

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


    let user = await sequelize.model('user').findOne({
      'where': {
        'email': {
          '$like': `%${email}%`
        }
      }
    });

    if (utils.checkIfDataExists(user)) {
      return res.status(fourHundred).send(utils.responseMsg(errorMsg.userExists));
    }

    let createUser = await sequelize.model('user').create({
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

    res.status(twoNotOne).send(utils.responseMsg(null, true, createUser));
  } catch (error) {
    errorLog.error(error);
    // logger.log(error)
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};
