const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({
            message: 'Notes',
        });
    });
};

export default routes;
