var book = require('../models/book.js');

module.exports = function (router) {
	router.get('/', getBook);
	router.get('/:number/:name', insertBook);
	
	return router;
};

function getBook (req, res) {
	res.send('bookDB');
}

function insertBook (req, res) {
	var data = new book();
	
	data.number = req.params.number;
	data.name = req.params.name;
	
	data.save(function (err) {
		if (err) {
			res.send(err);
			
			return ;
		}
		
		res.send({ok : 1});
	});
}