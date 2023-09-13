import express from 'express';
import userController from '../controllers/userController.js';
import paginate from '../middlewares/paginator.js';
import checkPermissions from '../middlewares/accessControl.js';

const router = express.Router();

router
    .get('/users', checkPermissions('readAny', 'user'), userController.showAll, paginate)
    .get('/users/:id', checkPermissions('readOwn', 'user'), userController.showOneById)
    .post('/users', checkPermissions('createAny', 'user'), userController.addOne)
    .put('/users/:id', checkPermissions('updateOwn', 'user'), userController.updateOne)
    .delete('/users/:id', checkPermissions('deleteOwn', 'user'), userController.deleteOne);

export default router;
