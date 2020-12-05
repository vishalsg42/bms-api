const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

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

// router.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
//   res.json("Success! You can not see this without a token");
// });

module.exports = router;
