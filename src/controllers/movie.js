const db = require('../config/dbConfig').default;
const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');

const {
  statusCodes: {
    fiveHundred,
    twoHundred,
  }
} = utils;

const {
  logger: {
    errorLog
  }
} = require('../../logger');

/**
 * getPlayingMovies
 * @param {Object} req request object
 * @param {Object} res response object
 */
exports.getPlayingMovies = async (req, res) => {
  try {
    let {
      id
    } = req.params;

    let checkIfCityExist = await db.city.findByPk(id);

    if (!utils.checkIfDataExists(checkIfCityExist)) {
      return res.status(twoHundred).send(utils.responseMsg('City does not exist'));
    }

    let queryString = `
      SELECT title, duration FROM movies WHERE id 
        IN
        ( 
          SELECT movie_id FROM shows
          WHERE cinema_hall_id 
          IN
            ( SELECT  id FROM cinema_halls
              WHERE cinema_id 
              IN
                (
                  SELECT id FROM cinemas 
                  WHERE city_id = :city_id
                )
              )
        )
    `;

    const fetchMovieList = await db.sequelize.query(queryString, {
      replacements: {
        'city_id': id
      },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(twoHundred).send(utils.responseMsg(null, true, fetchMovieList));

  } catch (error) {
    errorLog.error(error);
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};
