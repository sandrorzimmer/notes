import users from './userRoutes.js';

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({
            message: 'Notes',
        });
    });

    app.use(
        users,
    );
};

export default routes;
