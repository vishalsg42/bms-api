const router = require('express').Router();
const dependencies = require('./routesDependencies').default;
const passport = require('passport');

/**
 * @swagger
 * /user/register:
 *  post:
 *    tags:
 *      - User
 *    name: User Registration
 *    summary: To register user with the help of email & password.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - email
 *         - password
 *    responses:
 *      200:
 *        description: Registered user will be returned.
 *      400:
 *        description: User already exist.
 *      500:
 *        description: Internal server error.
 */
router.post('/user/register', dependencies.user.registerUser);

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - User
 *    name: User Signin
 *    summary: Generate Token to login
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - email
 *         - password
 *    responses:
 *      200:
 *        description: Auth token should be returned.
 *      400:
 *        description: User already exist.
 *      500:
 *        description: Internal server error.
 */
router.post('/login', dependencies.user.login);

/**
 * @swagger
 * /city/{id}/movies:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - Endpoints
 *    name: List of movies playing in city
 *    summary: View all the movies playing in the city
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        type: string
 *        description: Pass the id of the city
 *        required: true
 *    responses:
 *      200:
 *        description: List of the movie list.
 *      400:
 *        description: City should exist.
 *      500:
 *        description: Internal server error.
 */
router.get('/city/:id/movies',passport.authenticate('jwt', { session: false }), dependencies.movie.getPlayingMovies);

/**
 * @swagger
 * /movie/{id}/cinemas:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - Endpoints
 *    name: List of cinemas with showtime of a movie
 *    summary: View all cinemas in which a movie is playing along with all the showtimes.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        type: string
 *        description: Movie Id
 *        required: true
 *    responses:
 *      200:
 *        description: List of the cinema list along with showtimes
 *      400:
 *        description: Movie should be released
 *      500:
 *        description: Internal server error.
 */
router.get('/movie/:id/cinemas',passport.authenticate('jwt', { session: false }), dependencies.movie.getMoviesByCinemas);

/**
 * @swagger
 * /user/{userId}/show/{showId}/book:
 *  post:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - Endpoints
 *    name: Books the ticket for a particular user.
 *    summary: Books the ticket of a user in for a particular show.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: userId
 *        in: path
 *        type: string
 *        description: id of user to book the ticket
 *        required: true
 *      - name: showId
 *        in: path
 *        type: string
 *        description: Id of show which the ticket should be booked
 *        required: true
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          seats:
 *           type: array
 *           items:
 *             type: string
 *    responses:
 *      200:
 *        description: Successfully booked the ticket
 *      400:
 *        description: Invalid showId
 *      500:
 *        description: Internal server error.
 */
router.post('/user/:userId/show/:showId/book',passport.authenticate('jwt', { session: false }), dependencies.movie.bookTicket);

/**
 * @swagger
 * /show/{showId}/seats:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - Endpoints
 *    name: List of availability of seats for a particular seat.
 *    summary: View available seats in for a show.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: showId
 *        in: path
 *        type: string
 *        description: id of show to be checked
 *        required: true
 *    responses:
 *      200:
 *        description: List of availability of seats for a particular seat.
 *      400:
 *        description: Invalid show id
 *      500:
 *        description: Internal server error.
 */
router.get('/show/:id/seats', passport.authenticate('jwt', { session: false }), dependencies.movie.getAvailableSeatsBasedOnShow);

// router.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
//   res.json("Success! You can not see this without a token");
// });

module.exports = router;
