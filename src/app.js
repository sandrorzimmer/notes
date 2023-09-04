import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import handler404 from './middlewares/handler404.js';
import errorHandler from './middlewares/errorHandler.js';

const corsOptions = {
    origin: 'https://example.com', // replace with the real origin
    methods: 'GET, HEAD, PUT, POST, DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
routes(app);
app.use(handler404);
app.use(errorHandler);

export default app;
