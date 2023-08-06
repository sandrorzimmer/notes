import express from 'express';
import userController from '../controllers/userController.js';
import paginate from '../middlewares/paginator.js';

const router = express.Router();

router
    .get('/users', userController.showAll, paginate)
    .get('/users/:id', userController.showOneById)
    .post('/users', userController.addOne)
    .put('/users/:id', userController.updateOne)
    .delete('/users/:id', userController.deleteOne);

export default router;
