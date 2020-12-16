const db = require('../config/dbConfig').default;
const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');
const Joi = require('@hapi/joi');

const {
  statusCodes: {
    fiveHundred,
    twoHundred,
    fourHundred
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

/**
 * getMoviesByCinemas
 * @param {Object} req request object
 * @param {Object} res response object
 */
exports.getMoviesByCinemas = async (req, res) => {
  try {
    let {
      id
    } = req.params;

    let checkIfValidMovie = await db.movies.findByPk(id);

    if (!utils.checkIfDataExists(checkIfValidMovie)) {
      return res.status(twoHundred).send(utils.responseMsg('Invalid movie id'));
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
    fetchMovieList = mapValues(groupBy(fetchMovieList, 'cinema_id'), clist => clist.map(car => omit(car, ['cinema_id', 'cinema_name'])));
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

/**
 * bookTicket
 * @param {Object} req request object
 * @param {Object} res response object
 */
exports.bookTicket = async (req, res) => {
  let transaction = null;
  try {

    if (!utils.checkIfDataExists(req.body)) {
      return res.status(twoHundred).send(utils.responseMsg(errorMsg.noPostDataProvided));
    }

    let {
      userId,
      showId
    } = req.params;

    let {
      seats
    } = req.body;

    const schema = Joi.object({
      seats: Joi.array().min(1).items(Joi.string()).error(new Error('Minimum 1 seat is required to book the seats')),
    });

    const result = schema.validate({
      seats
    });

    if (result.error) {
      return res.status(fourHundred).send(utils.responseMsg(errorMsg.invalidDataProvided(result.error.message)));
    }

    let {
      Sequelize: {
        Transaction
      }
    } = db;

    // Initialzing the transaction
    transaction = await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    let transactionParams = {
      transaction,
      lock: true
    };

    // Check if seats are available.
    let seatQuery = {
      where: {
        'show_id': showId,
        'booking_id': {
          '$or': [
            {
              '$eq': null
            },
            {
              '$eq': ''
            }
          ]
        },
        id: {
          '$in': seats,
        }
      },
      transactionParams
    };

    let availableSeats = await this.getAvailableSeats(seatQuery);

    // If not return with message ticket been sold already.
    if (Array.isArray(availableSeats) && availableSeats.length !== seats.length) {
      return res.status(fourHundred).send(utils.responseMsg(errorMsg.invalidDataProvided('Sorry, seats are already booked')));
    }

    // If available book the seat.
    let bookSeat = await db.booking.create({
      number_of_seats: seats.length,
      user_id: userId,
      show_id: showId,
    }, transactionParams);

    // update the booked tickets
    // Below db call can be executed as hook attached to booking schema
    await db.showSeat.update({
      booking_id: bookSeat.dataValues.id
    }, {
      'where': {
        'id': {
          '$in': seats
        }
      }
    }, transactionParams);

    await transaction.commit();

    return res.status(twoHundred).send(utils.responseMsg(null, true, 'Successfully ticket has been booked'));
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    errorLog.error(error);
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};

/**
 * getAvailableSeats
 * @param {Object} req request object
 * @param {Object} res response object
 */
exports.getAvailableSeatsBasedOnShow = async (req, res) => {
  try {
    let {
      id
    } = req.params;

    let {
      type
    } = req.query;

    let query = {
      'where': {
        'show_id': id
      }
    };
    if (type === 'available') {
      query['where']['booking_id'] = { '$eq': null };
    }

    if (type === 'booked') {
      query['where']['booking_id'] = { '$ne': null };
    }
    let avaibleSeats = await this.getAvailableSeats(query);
    return res.status(twoHundred).send(utils.responseMsg(null, true, avaibleSeats));

  } catch (error) {
    errorLog.error(error);
    return res.status(fiveHundred).send(utils.responseMsg(errorMsg.internalServerError));
  }
};


exports.getAvailableSeats = async (query) => {
  try {
    let avaibleSeats = await db.showSeat.findAll({ ...query });
    return avaibleSeats;
  } catch (error) {
    errorLog.error(error);
    throw new Error(error);
  }
};
