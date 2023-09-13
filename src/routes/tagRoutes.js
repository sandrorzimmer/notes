import express from 'express';
import TagController from '../controllers/tagController.js';
import paginate from '../middlewares/paginator.js';
import checkPermissions from '../middlewares/accessControl.js';

const router = express.Router();

router
    .get('/tags', checkPermissions('readAny', 'tag'), TagController.showAll, paginate)
    .get('/tags/:id', checkPermissions('readOwn', 'tag'), TagController.showOneById, paginate)
    .post('/tags', checkPermissions('createOwn', 'tag'), TagController.addOne, paginate)
    .put('/tags/:id', checkPermissions('updateOwn', 'tag'), TagController.updateOne, paginate)
    .delete('/tags/:id', checkPermissions('deleteOwn', 'tag'), TagController.deleteOne, paginate);

export default router;
