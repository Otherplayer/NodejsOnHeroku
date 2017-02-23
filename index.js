var cool = require('cool-ascii-faces');
var express = require('express');
var pg = require('pg');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index')
});


var user = {'Europe':100, 'North America':200, 'South America':300, 'Asia':400, 'Africa':500};


app.get('/webhook', function(request, response) {
    var result = JSON.stringify(user);
    response.send(result);
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
