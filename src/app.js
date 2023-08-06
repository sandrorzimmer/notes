import express from 'express';
import routes from './routes/index.js';
import handler404 from './middlewares/handler404.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
routes(app);
app.use(handler404);
app.use(errorHandler);

export default app;
