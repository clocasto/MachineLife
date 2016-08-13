var express = require('express');
var morgan = require('morgan');
var chalk = require('chalk');
var swig = require('swig');
var app = express();
var ngrok = require('ngrok');

app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({
    cache: false
});

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
    res.render(__dirname + '/index.html');
});

var server = app.listen(3000, function(err) {
    if (err) throw err;
    console.log(chalk.yellow('Now listening:'), '3000');
});

ngrok.connect(3000,function(err,url) {
	if (err) throw err;
	console.log(chalk.red('Internet Address:'),url);
});
