var express = require('express');
var http = require('http');
var router = express.Router();

router.post('/login', function(req, res, next) {
    var reqJosnData = JSON.stringify(req.body);
    var postheaders = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
    };

    // the post options  
    var optionspost = {
        host: global.hostAddress,
        port: global.portNum,
        path: global.ctx + '/login',
        method: 'POST',
        headers: postheaders

    };

    // do the POST call  
    var reqPost = http.request(optionspost, function(resPost) { //req.cookies.access_token

        resPost.on('data', function(d) {
            var json = JSON.parse(d);
            var ret = json.ret;
            if (ret == 0) {
                var token = json.msg;
                if (token != '' && token != undefined) {
                    res.cookie('access_token', token, { maxAge: 25 * 60 * 1000, path: '/' }); //25分钟过期
                }
            }
            res.send(d);

        });
    });

    // write the json data  
    // 发送REST请求时传入JSON数据  
    reqPost.write(reqJosnData);
    reqPost.end();
    reqPost.on('error', function(e) {
        
    });
}).post('/logout', function(req, res, next) {
    var reqJosnData = req.query.access_token;
    var postheaders = {
        'Content-Type': 'application/json; charset=UTF-8',
    };

    // the post options  
    var optionspost = {
        host: global.hostAddress,
        port: global.portNum,
        path: global.ctx + '/logout/'+reqJosnData,
        method: 'POST',
        headers: postheaders
    };
    // do the POST call  
     var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
}).post('/regist', function(req, res, next) {
    var reqJosnData = JSON.stringify(req.body);
    var postheaders = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
    };

    // the post options  
    var optionspost = {
        host: global.hostAddress,
        port: global.portNum,
        path: global.ctx + '/register',
        method: 'POST',
        headers: postheaders

    };

    // do the POST call  
    var reqPost = http.request(optionspost, function(resPost) {

        resPost.on('data', function(d) {
            res.send(d);
        });
    });
    // write the json data  
    // 发送REST请求时传入JSON数据  
    reqPost.write(reqJosnData);
    reqPost.end();
    reqPost.on('error', function(e) {
    });
}).post('/captcha', function(req, res, next) {
    var reqJosnData = JSON.stringify(req.body);
    var postheaders = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
    };

    // the post options  
    var optionspost = {
        host: global.hostAddress,
        port: global.portNum,
        path: global.ctx + '/captcha',
        method: 'POST',
        headers: postheaders

    };

    // do the POST call  
    var reqPost = http.request(optionspost, function(resPost) {

        resPost.on('data', function(d) {
            var json = JSON.parse(d);
            var ret = json.ret;
            res.send(d);

        });
    });
    // write the json data  
    // 发送REST请求时传入JSON数据  
    reqPost.write(reqJosnData);
    reqPost.end();
    reqPost.on('error', function(e) {
    });
}).post('/checkVerification', function(req, res, next) {
    var reqJosnData = JSON.stringify(req.body);
    var postheaders = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
    };

    // the post options  
    var optionspost = {
        host: global.hostAddress,
        port: global.portNum,
        path: global.ctx + '/userInfo/checkVerification',
        method: 'POST',
        headers: postheaders

    };

    // do the POST call  
    var reqPost = http.request(optionspost, function(resPost) {

        resPost.on('data', function(d) {
            var json = JSON.parse(d);
            var ret = json.ret;
            res.send(d);

        });
    });
    // write the json data  
    // 发送REST请求时传入JSON数据  
    reqPost.write(reqJosnData);
    reqPost.end();
    reqPost.on('error', function(e) {
    });
}).post('/resetPassword', function(req, res, next) {
    var reqJosnData = JSON.stringify(req.body);
    var token=req.query.token;
    var postheaders = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
    };

    // the post options  
    var optionspost = {
        host: global.hostAddress,
        port: global.portNum,
        path: global.ctx + '/userInfo/resetPassword?token='+token,
        method: 'POST',
        headers: postheaders

    };

    // do the POST call  
    var reqPost = http.request(optionspost, function(resPost) {

        resPost.on('data', function(d) {
            var json = JSON.parse(d);
            var ret = json.ret;
            res.send(d);

        });
    });
    // write the json data  
    // 发送REST请求时传入JSON数据  
    reqPost.write(reqJosnData);
    reqPost.end();
    reqPost.on('error', function(e) {

    });
});

module.exports = router;
