import { Router } from 'express';
import Mailer from '../utils/Mailer';
import { VotesController, TransformCSV, CSVProcessor, Reader } from '../controllers/';
import { getFilteredCSVS, toFormElm } from '../utils';

export default () => {
    const router = Router();

    router.get('/filenames', (req, res) => {
        getFilteredCSVS()
            .then(files => {
                res.send(toFormElm(files));
            })
            .catch(e => res.send(e));
    });

    router.post('/headers', (req, res, next) => {
        const reader = new Reader(req.body.filename);
        reader
            .getCSVHeader()
            .then(rows => res.send(toFormElm(rows)))
            .catch(next);
    });

    router.post('/processcsv', (req, res, next) => {
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

    return router;
};
