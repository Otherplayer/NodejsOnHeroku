
var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');


var app = express();
var jsonParser = bodyParser.json();// create application/json parser https://github.com/expressjs/body-parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });// create application/x-www-form-urlencoded parser

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,Authorization, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});




var cost = {'北京':100, '上海':200, '郑州':300, '西安':400, '海口':500};



app.get('/index.html', function(request, response) {
    response.sendFile( __dirname + "/" + "index.html" );
});

app.post('/login',function (request,response) {
    console.log(request.body);
    response.send(cool());
});

//// POST /webhook gets JSON bodies
app.post('/webhook', jsonParser, function(request, response) {

    var reqParams = request.body.result;
    logger(reqParams);

    if (reqParams['action']['name'] != 'delivery.cost'){
        return {};
    }
    var parameters = reqParams.action["parameters"];
    var zone = parameters["geo-city"];
    var speech = "运输到 " + zone + " 的费用是 " + cost[zone] + " RMB。";
    logger(speech);

    var result = {
        "speech": speech,
        "displayText": speech,
        "source": "online-delivery-cost-query"
    };

    // var result = JSON.stringify(result);
    if (!request.body) return request.sendStatus(400);
    response.send(result);

});

function logger(val) {
    console.log(val);
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

