import express from 'express';
import NoteController from '../controllers/noteController.js';
import paginate from '../middlewares/paginator.js';

const router = express.Router();

router
    .get('/notes', NoteController.showAll, paginate)
    .get('/notes/:id', NoteController.showOneById, paginate)
    .post('/notes', NoteController.addOne, paginate)
    .put('/notes/:id', NoteController.updateOne, paginate)
    .delete('/notes/:id', NoteController.deleteOne, paginate);

export default router;
