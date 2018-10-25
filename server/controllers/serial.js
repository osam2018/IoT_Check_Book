// Serial
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var port = new SerialPort('COM3');
var parser = new Readline();

var user = require('../models/user.js');
var book = require('../models/book.js');
var rent = require('../models/rent.js');

port.pipe(parser);

var serial_data = [];

module.exports = function(router) {
	router.get('/', getIndex);
	router.get('/:type/:number/:book_number', writeSerial);
	
	return router;
};

function getIndex (req, res) {
	res.send('index');
}

function writeSerial (req, res) {
	var data = {
		type : req.params.type,
		number : req.params.number,
		book_number : req.params.book_number
	};
	
	console.log(data);
	
	var conditions = {};
	
	conditions = {
		number : data.number
	};
	
	user.find(conditions, function (err, result) {
		if (result.length > 0) {
			conditions = {
				number : data.book_number
			};
			
			book.find(conditions, function (err, result) {
				if (result.length > 0) {
					console.log('write : true');
				}
			});
		}
	});
}