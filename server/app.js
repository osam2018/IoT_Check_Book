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

mongoose.connect('mongodb://localhost:27017/rent', { useNewUrlParser : true});
//mongo --host 54.180.66.63:52865

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

app.listen(8080, function () {
	console.log('start server');
});