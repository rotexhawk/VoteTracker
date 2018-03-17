import VotesController from '../controllers/VotesController';
import moment from 'moment';

const votesController = new VotesController(
	moment('2018-03-06', 'YYYY-MM-DD'),
	'primary',
	false
);

test('VotesController Year to be 2018', () => {
	expect(votesController.getYear()).toBe(2018);
});

test('VotesController Get Update Method to be false', () => {
	expect(votesController.getUpdate()).toBe(false);
});

test('VotesController Table to be prim2018', () => {
	expect(votesController.getTable()).toBe('prim2018');
});
