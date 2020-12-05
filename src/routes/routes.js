const router = require('express').Router();
const appRoutes = require('./appRoutes');
const dependencies = require('./routesDependencies').default;

/**
 * @swagger
 * /health:
 *  get:
 *    tags:
 *      - Server Health Check 
 *    name: Server Health Check
 *    summary: This is api to check server health.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: successfully send.
 *      500:
 *        description: Internal server error.
 */
router.get('/health', dependencies.serverHealth.checkHealth);

router.use('/', appRoutes);

module.exports = router;
