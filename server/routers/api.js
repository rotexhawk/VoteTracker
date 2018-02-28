import { Router } from 'express';
import Mailer from '../utils/Mailer';
import { VotesController, Transformer, Validator, Reader } from '../controllers/';
import { getFiles, toFormElm } from '../utils';

export default () => {
    const router = Router();

    router.get('/filenames', (req, res) => {
        getFiles()
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
        const validator = new Validator(req.body);
        const transformer = new Transformer(validator.getFileName(), validator.getRow());
        const votesController = new VotesController(
            validator.getElectionDate(),
            validator.getElectionType(),
            validator.getUpdate()
        );
        const mailer = new Mailer();
        res.send({ message: 'CSV parsing Initiated' });

        transformer
            .transform()
            .then(csv => votesController.importCSV(csv))
            .then(sqlRes => {
                transformer.destroy();
                return sqlRes;
            })
            .then(sqlRes =>
                mailer
                    .sendImportResults(null, {
                        numRows: sqlRes.affectedRows,
                        filename: validator.getFileName(),
                        election_year: validator.getElectionYear(),
                        election_type: validator.getElectionType()
                    })
                    .then(body => console.log('all done', body))
                    .catch(next)
            )
            .catch(e => {
                console.log('error from db', e);
                mailer
                    .sendImportResults(e, {
                        filename: validator.getFileName(),
                        election_year: validator.getElectionYear(),
                        election_type: validator.getElectionType()
                    })
                    .then(body => console.log('error results sent.', body))
                    .catch(next);
            });
    });

    return router;
};
