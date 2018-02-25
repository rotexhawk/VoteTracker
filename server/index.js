import express from 'express';
import bodyParser from 'body-parser';
import serverErrorHandler from './middleware/serverErrorHandler';
import logger from './middleware/logger';
import { view, api } from './routers';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', view());
app.use('/api', api());
app.use(serverErrorHandler());
app.use(logger());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started at: http://localhost:${port}`));
