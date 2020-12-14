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

const {
  groupBy,
  mapValues,
  omit,
  map,
  uniqBy
} = require('lodash');

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

    // fetchMovieList = 

    return res.status(twoHundred).send(utils.responseMsg(null, true, fetchMovieList));

  } catch (error) {
    errorLog.error(error);
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};


exports.getMoviesByCinemas = async (req, res) => {
  try {
    let {
      id
    } = req.params;

    let checkIfValidMovie = await db.movies.findByPk(id);

    if (!utils.checkIfDataExists(checkIfValidMovie)) {
      return res.status(twoHundred).send(utils.responseMsg('City does not exist'));
    }

    let query = `
    SELECT
    mv.id,
    mv.title,
    ch.name,
    DATE_FORMAT(
      sh.start_time,
      '%d/%m/%Y'
  ) AS show_date,
    DATE_FORMAT(
      sh.start_time,
      '%H:%i %p'
  ) AS start_time,
  DATE_FORMAT(
    sh.end_time,
    '%H:%i %p'
) AS end_time,
    cn.name AS cinema_name
FROM
    movies AS mv,
    shows AS sh,
    cinema_halls AS ch,
    cinemas AS cn
WHERE
    mv.id = sh.movie_id AND sh.cinema_hall_id = ch.id AND ch.cinema_id = cn.id AND mv.id = :movie_id AND sh.start_time > NOW()
ORDER BY
    sh.start_time ASC
`;

    let fetchMovieList = await db.sequelize.query(query, {
      replacements: {
        'movie_id': id
      },
      type: db.Sequelize.QueryTypes.SELECT
    });

    let cinema = uniqBy(map(fetchMovieList, cn => { return { cinema_name: cn.cinema_name, cinema_id: cn.cinema_id }; }), 'cinema_name');
    fetchMovieList = mapValues(groupBy(fetchMovieList, 'cinema_id'), clist => clist.map(car => omit(car,[ 'cinema_id', 'cinema_name'])));
    cinema = map(cinema, cn => {
      cn['show_time'] = fetchMovieList[cn.cinema_id];
      return cn;
    });
    return res.status(twoHundred).send(utils.responseMsg(null, true, cinema));
    // return res.status(twoHundred).send(utils.responseMsg(null, true, cinema));
  } catch (error) {
    errorLog.error(error);
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};
