var user = require('../models/user.js');

module.exports = function (router) {
	router.get('/', getUser);
	router.get('/:number/:name', insertUser);
	
	return router;
};

function getUser (req, res) {
	res.send('userDB');
}

function insertUser (req, res) {
	var data = new user();
	
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