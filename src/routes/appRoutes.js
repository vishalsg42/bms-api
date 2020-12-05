const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

/**
 * @swagger
 * /user/register:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Local Login API
 *    summary: Based on user's data, this api sent jwt token which leads to login process.
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

module.exports = router;
