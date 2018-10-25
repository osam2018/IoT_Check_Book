var book = require('../models/book.js');

module.exports = function (router) {
	router.get('/', getBook);
	router.get('/:number/:name/:shelf', insertBook);

	return router;
};

function getBook (req, res) {
	var conditions = {};

	book.find(conditions, function (err, result) {
		res.send(result);
	});
}

function insertBook (req, res) {
	var data = new book();

	data.number = req.params.number;
	data.name = req.params.name;
	data.shelf = req.params.shelf;

	data.save(function (err) {
		if (err) {
			res.send(err);

			return ;
		}

		res.send({ok : 1});
	});
}
