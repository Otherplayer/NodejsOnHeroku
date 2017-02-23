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


var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var user = {'Europe':100, 'North America':200, 'South America':300, 'Asia':400, 'Africa':500};


app.post('/webhook', urlencodedParser, function(request, response) {
    console.log(request.baseUrl);
    console.log(request.body);
    console.log(request.hostname);
    console.log(request.path);
    console.log(request.headers);

    // 输出 JSON 格式
    response = {
        first_name:request.body.first_name,
        last_name:request.body.last_name
    };
    console.log(response);

    var result = JSON.stringify(user);
    response.send(response);

});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
