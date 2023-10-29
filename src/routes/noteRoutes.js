import express from 'express';
import NoteController from '../controllers/noteController.js';
import paginate from '../middlewares/paginator.js';
import checkPermissions from '../middlewares/accessControl.js';

const router = express.Router();

router
    .get('/notes', checkPermissions('readAny', 'note'), NoteController.showAll, paginate)
    .get('/notes/search', checkPermissions('readAny', 'note'), NoteController.showByFilter, paginate)
    .get('/notes/:id', checkPermissions('readOwn', 'note'), NoteController.showOneById, paginate)
    .post('/notes', checkPermissions('createOwn', 'note'), NoteController.addOne, paginate)
    .put('/notes/:id', checkPermissions('updateOwn', 'note'), NoteController.updateOne, paginate)
    .delete('/notes/:id', checkPermissions('deleteOwn', 'note'), NoteController.deleteOne, paginate);

export default router;
