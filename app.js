var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('myapp:server');
var http = require('http');
var path = require('path');
var jade = require('jade');
var os = require('os');
// var favicon = require('serve-favicon');
//设置路由 
var routeStart = require('./functions/start');
var home = require('./functions/home');
var login = require('./functions/login');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'home'))); //引用path完成模板根目录的设置

//全局变量
global.hostAddress = '192.168.1.202'; //192.168.1.202
global.portNum = '80'; //8083
global.ctx = '/mmcms/api'; //mmcms


// app.use(function(req, res, next) {
//     var url = req.originalUrl; //获取浏览器中当前访问的nodejs路由地址
//     var mark = '';
//     if (url.length > 1) {
//         mark = url.split('/')[1];
//     } else {
//          res.redirect('/');
//     }
//     if (mark != 'home' && mark != 'login' && mark != 'start') {
//         res.redirect('/');
//     }

//     next();
// });


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});
app.use('/', routeStart);
app.use('/home', home);
app.use('/login', login);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.redirect('/');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//这里设置nodejs启动的文件，一般是JS利用router加载html母版页 


//创建程序的http服务
module.exports = app;