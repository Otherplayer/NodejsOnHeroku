var cool = require('cool-ascii-faces');
var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,Authorization, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/index.html', function(request, response) {
    response.sendFile( __dirname + "/" + "index.html" );
});




var cost = {'Europe':100, 'North America':200, 'South America':300, 'Asia':400, 'Africa':500};


app.post('/login',function (request,response) {
    console.log(request.body);
    response.send(cool());
});

app.post('/webhook', function(request, response) {

    var reqParams = request.body.result;
    console.log(reqParams);
    if (reqParams['action'] != 'shipping.cost'){
        return {};
    }
    var parameters = reqParams["parameters"];
    var zone = parameters["delivery-zone"];//shipping-zone
    var speech = "The cost of shipping to " + zone + " is " + cost[zone] + " euros.";
    // console.log(parameters);
    // console.log(zone);
    console.log(speech);

    var result = {
        "speech": speech,
        "displayText": speech,
        // "data": {},
        // "contextOut": [],
        "source": "apiai-onlinestore-shipping"
    };

    // console.log(result);
    // var result = JSON.stringify(result);
    // if (!request.body) return res.sendStatus(400);
    response.send(result);

});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
