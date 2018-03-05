import express from 'express';
import path from 'path';

export default () => {
	const router = express.Router();

	router.use(
		express.static(path.join(__dirname, '../..', 'client', 'build'))
	);

	router.get('/', function(req, res) {
		res.sendFile(
			path.join(__dirname, '../..', 'client', 'build', 'index.html')
		);
	});

	return router;
};
