import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import routes from './routes/jobRoutes';

const app:Application = express();

app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use('/', routes);

export default app;
