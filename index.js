
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


var cost = {'北京':100000, '上海':200000, '郑州':450000, '西安':710000, '海口':500};



// app.get('/index.html', function(request, response) {
//     response.sendFile( __dirname + "/" + "index.html" );
// });
//
app.get('/login',function (request,response) {
    console.log(request.body);
    response.send(cool());
});

//// POST /webhook gets JSON bodies
app.post('/webhook', jsonParser, function(request, response) {

    var reqParams = request.body.result;
    //logger(reqParams);

    if (reqParams['action']['name'] != 'postalcode.action'){
        return {};
    }
    var parameters = reqParams.action["parameters"];
    var zone = parameters["geo-city"];
    var post = cost[zone];
    var speech = "您好，" + zone + " 的邮编是 " + post + " 。";
    if (!post || post == 'undefined'){
        speech = '不好意思，未能查询到' + zone + '的邮编。';
    }
    logger(speech);

    var result = {
        "speech": speech,
        "displayText": speech,
        "source": "online-postal-code-query"
    };

    if (!request.body) return request.sendStatus(400);
    response.send(result);

});

var questions = {
    '100e5005':'不支持的付款方式。请首先确认商户目前测试的是什么环境，测试环境不支持直连银行方式，请将bankCode和userType置为空。生产环境报错请确认银行代码是否填写正确，或商户是否开通此银行权限。若还有问题请联系技术支持工程师协助解决。',
    '100e5001':'用户不存在或已注销。请首先确认商户目前测试的是什么环境，确保参数与环境对应正确，商户测试环境网关地址：https://gatewaymer.gopay.com.cn/Trans/WebClientAction.do，测试环境用户ID：0000001502。生产环境网关地址获取请联系技术支持工程师。',
    '100e1005':'交易代码错误。请首先确认交易代码tranCode是否填写正确，如果交易代码正确仍报错，表示商户的上送的交易报文没有发送到国付宝网关，建议商户确认一下提交表单的参数是否正确后，再次向国付宝的网关地址发起交易。',
    '100e1040':'收款方虚拟账号错。请商户核实上传表单参数virCardNoIn国付宝转入账户（19位的数字）填写是否正确。',
    '100e8004':'系统验签失败。请商户核对一下MD5加密域， MD5明文串需严格遵守以下格式，所有字段即使有的值为空也必须出现，并且各个字段的顺序不能改变：提交订单参数数据加密实例：version=[2.1]tranCode=[8888]merchantID=[0000001502]merOrderNum=[ xxx789xx]tranAmt=[10.00]feeAmt=[]tranDateTime=[20121025154955]frontMerUrl=[]backgroundMerUrl=[http://www.baidu.com]orderId=[]gopayOutOrderId=[]tranIP=[127.0.0.1]respCode=[]gopayServerTime=[]VerficationCode=[11111aaaaa]接收返回参数校验数据加密实例：version=[2.1]tranCode=[8888]merchantID=[0000001502]merOrderNum=[ xxx789xx]tranAmt=[10.00]feeAmt=[5]tranDateTime=[20121025154955]frontMerUrl=[]backgroundMerUrl=[http://www.baidu.com]orderId=[20121025154988]gopayOutOrderId=[20121025154988]tranIP=[127.0.0.1]respCode=[0000]gopayServerTime=[]VerficationCode=[11111aaaaa]当明文串拼好后，把明文串进行加密操作，字符集格式utf-8，生成类似32位16进制密文，例：82ce1938fe56ac17d52aecaa428667e7。若商户仍然无法定位问题原因，请联系技术支持工程师协助查询。',
    '100e5003':'客户号与账户不匹配。请商户核对merchantID商户代码（用户ID）与virCardNoIn国付宝转让账户填写是否正确。',
    '100e1016':'客户IP错误。请商户核实tranIP是否填写正确，或提供报错订单号给技术支持工程师协助查询。'
};


app.post('/gfbquestion', jsonParser, function(request, response) {

    var reqParams = request.body.result;
    //logger(reqParams);

    if (reqParams['action']['name'] != 'errcode.action'){
        return {};
    }
    var parameters = reqParams.action["parameters"];
    var errcode = parameters["errcode"].toLowerCase();
    var ans = questions[errcode];
    var speech = ans;
    if (!ans || ans == 'undefined'){
        speech = '不好意思，未能查询到' + ans + '的问题。请与我们的技术工程师联系。';
    }
    logger(speech);

    var result = {
        "speech": speech,
        "displayText": speech,
        "source": "online-postal-code-query"
    };

    if (!request.body) return request.sendStatus(400);
    response.send(result);

});

function logger(val) {
    console.log(val);
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

