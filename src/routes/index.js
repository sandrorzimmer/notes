import logger from '../logs/logger.js';
import users from './userRoutes.js';
import login from './loginRoutes.js';
import tag from './tagRoutes.js';
import note from './noteRoutes.js';
import checkAuthentication from '../middlewares/checkAuthentication.js';

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({
            message: 'Notes',
        });
    });

    // Apply the checkAuthentication middleware to all routes except login
    app.use((req, res, next) => {
        if (req.path === '/login' || (req.path === '/users' && req.method === 'POST')) {
            logger.info(`Received ${req.method} request to ${req.originalUrl}`);
            next(); // Skip the middleware for the login endpoint
        } else {
            checkAuthentication(req, res, next); // Apply the middleware to other endpoints
            logger.info(`Received ${req.method} request to ${req.originalUrl} from user ${req.user.userId}`);
        }
        // console.log(req.user);
    });

    app.use(
        users,
        login,
        tag,
        note,
    );
};

export default routes;
