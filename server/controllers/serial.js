// Serial
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var port = new SerialPort('COM3');
var parser = new Readline();

port.pipe(parser);

var serial_data = [];

module.exports = function(router) {
	router.get('/', getIndex);
	
	return router;
};

function getIndex (req, res) {
	res.send('index');
}

parser.on('data', function (data) {
	console.log('Read Data : ' + data);
	if (data == 'end') {
		data_parse(serial_data);
		serial_data = [];
		
		console.log('end');
	} else if (data == 'cancle') {
		
	} else {
		serial_data.push(data);
	}
});

function data_parse (data) {
	var d = {};
	
	if (data.length == 2) {
		d = {
			type : data[0],
			number : data[1],
			book_number : data[2]
		};
	} else {
		d = {
			type : data[0],
			book_number : data[1]
		};
	}
	
	console.log(d);
}