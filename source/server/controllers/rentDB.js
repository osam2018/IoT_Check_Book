var rent = require('../models/rent.js');

module.exports = function (router) {
	router.get('/', getRent);

	return router;
};

function getRent (req, res) {
	var conditions = {};

	rent.find(conditions, function (err, result) {
		res.send(result);
	});
}
