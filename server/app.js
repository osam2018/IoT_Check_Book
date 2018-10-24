var express = require('express');
var app = express();

var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var port = new SerialPort('/dev/tty', {
	baudRate : 9600
});
var parser = port.pipe(new Readline({ delimiter : '\n' }));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

parser.on('open', function () {
	console.log('open serial');
});

parser.on('error', function (err) {
	console.log('error serial');
});

parser.on('data', function (data) {
	console.log('Read Data : ' + data);
});

/*
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/tty-usbserial1')

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', console.log)
*/