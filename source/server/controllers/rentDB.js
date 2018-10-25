var rent = require('../models/rent.js');

module.exports = function (router) {
	router.get('/', getRent);
	
	return router;
};

function getRent (req, res) {
	res.send('rentDB');
}