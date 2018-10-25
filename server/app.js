var express = require('express');
var app = express();
var fs = require('fs');

// BodyParser
var bodyParser = require('body-parser');

// mongoose
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});
const mongodb_url = 'localhost';
const mongodb_port = 27017;

mongoose.connect('mongodb://' + mongodb_url + ':' + mongodb_port + '/rent', { useNewUrlParser : true});
// mongodb://osam:osam@localhost:27017/rent?authSource=admin

// Serial
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var port = new SerialPort('COM3');
var parser = new Readline();

port.pipe(parser);

var serial_data = [];

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

var path = require('path');

// Controllers
fs.readdirSync('./controllers').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        var path = file.substring(0, file.length - 3);
        var router = express.Router();
        var controller = require('./controllers/' + path)(router);
        app.use('/' + path, controller);
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.use(function (req, res, next) {
	res.status(404).render('404', { url : req.originalUrl });
});

app.listen(80, function () {
	console.log('start server');
});

// Serial
var user = require('./models/user.js');
var book = require('./models/book.js');
var rent = require('./models/rent.js');

parser.on('data', function (data) {
  data = data.trim();
  console.log(data);

	if (data == 'end') {
    var parse_data = data_parse(serial_data);

		var conditions = {};

		conditions = {
			number : parse_data.number
		};

		user.find(conditions, function (err, user_result) {
			if (user_result.length > 0) {
				conditions = {
					number : parse_data.book_number
				};

				book.find(conditions, function (err, book_result) {
					if (book_result.length > 0) {
            if (parse_data.type == 'rent') {
              var data = new rent()

              data.user = user_result[0]._id;
              data.book = book_result[0]._id;

              data.save(function (err) {
                if (err) {
                  console.log('rent error');
                } else {
                  console.log('rent success');
                  port.write(book_result[0].shelf.toString());
      						console.log('write : true');
                }
              });
            } else if (parse_data.type == 'return') {
              conditions = {
                user : user_result[0]._id,
                book : book_result[0]._id
              };

              rent.find(conditions, function (err, rent_result) {
                if (rent_result.length > 0) {
                  var data = rent_result[0];

                  data.return = new Date();

                  conditions = {
                    _id : data._id
                  };

                  rent.updateOne(conditions, data, function (err, result) {
                    console.log('return success');
                    port.write(book_result[0].shelf.toString());
        						console.log('write : true');
                  });
                }
              });
            }
					} else {
						port.write('x');
            console.log('write : false');
					}
				});
			} else {
				port.write('x');
        console.log('write : false');
			}
		});

		serial_data = [];
	} else if (data == 'cancle') {

	} else {
		serial_data.push(data);
	}
});

function data_parse (data) {
	var d = {};

	if (data.length == 3) {
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

	return d;
}

function find_user (number) {
	var conditions = {
		number : number
	};

	user.find(conditions, function (err, result) {
		if (result.length > 0) {
			return true;
		}
	});

	return false;
}

function find_book (number) {
	var conditions = {
		number : number
	};

	book.find(conditions, function (err, result) {
		if (result.length > 0) {
			return true;
		}
	});

	return false;
}
