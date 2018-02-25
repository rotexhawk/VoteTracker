import express from 'express';
import bodyParser from 'body-parser';
import VotesController from './controllers/VotesController';
import TransformCSV from './controllers/TransformCSV';
import CSVProcessor from './controllers/CSVProcessor';
import serverErrorHandler from './middleware/serverErrorHandler';
import logger from './middleware/logger';
import Mailer from './utils/Mailer';
import Reader from './controllers/Reader';

import { getFilteredCSVS, toFormElm } from './utils';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    //election.insertData();
    res.send('gets here');
});

app.get('/api/filenames', (req, res) => {
    getFilteredCSVS()
        .then(files => {
            res.send(toFormElm(files));
        })
        .catch(e => res.send(e));
});

app.post('/api/headers/', (req, res, next) => {
    const reader = new Reader(req.body.filename);
    reader
        .getCSVHeader()
        .then(rows => res.send(toFormElm(rows)))
        .catch(next);
});

app.post('/api/processcsv', (req, res, next) => {
    const csvProcessor = new CSVProcessor(req.body);
    const transformer = new TransformCSV(csvProcessor.getFileName(), csvProcessor.getRow());
    const votesController = new VotesController(
        csvProcessor.getElectionDate(),
        csvProcessor.getElectionType(),
        csvProcessor.getUpdate()
    );
    const mailer = new Mailer();
    res.send({ message: 'CSV parsing Initiated' });

    transformer
        .transform()
        .then(csv => votesController.importCSV(csv))
        .then(sqlRes =>
            mailer
                .sendImportResults(null, {
                    numRows: sqlRes.affectedRows,
                    filename: csvProcessor.getFileName(),
                    election_year: csvProcessor.getElectionYear(),
                    election_type: csvProcessor.getElectionType()
                })
                .then(body => console.log('all done', body))
                .catch(next)
        )
        .catch(e => {
            console.log('error from db');
            mailer
                .sendImportResults(e, {
                    filename: csvProcessor.getFileName(),
                    election_year: csvProcessor.getElectionYear(),
                    election_type: csvProcessor.getElectionType()
                })
                .catch(next);
            next(e);
        });
    //transformer.getUnique({ name: 'voting_method' });
});

app.use(serverErrorHandler());
app.use(logger());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started at: http://localhost:${port}`));
