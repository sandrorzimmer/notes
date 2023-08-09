import users from './userRoutes.js';
import login from './loginRoutes.js';
import checkAuthentication from '../middlewares/checkAuthentication.js';

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({
            message: 'Notes',
        });
    });

    // Apply the checkAuthentication middleware to all routes except login
    app.use((req, res, next) => {
        if (req.path === '/login') {
            next(); // Skip the middleware for the login endpoint
        } else {
            checkAuthentication(req, res, next); // Apply the middleware to other endpoints
        }
    });

    app.use(
        users,
        login,
    );
};

export default routes;
