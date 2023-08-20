import express from 'express';
import TagController from '../controllers/tagController.js';
import paginate from '../middlewares/paginator.js';

const router = express.Router();

router
    .get('/tags', TagController.showAll, paginate)
    .get('/tags/:id', TagController.showOneById, paginate)
    .post('/tags', TagController.addOne, paginate)
    .put('/tags/:id', TagController.updateOne, paginate)
    .delete('/tags/:id', TagController.deleteOne, paginate);

export default router;
