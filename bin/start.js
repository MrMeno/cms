#!/usr/bin/env node

/**
 * 模块依赖项
 */

var app = require('../app');
var debug = require('debug')('localhost:server');
var http = require('http');

/**
 * 将设置好的端口号存入全局express
 */

var port = normalizePort(process.env.PORT || '3005');
app.set('port', port);

/**
 * 创建http服务
 */

var server = http.createServer(app);

/**
 * 在所有设备上监听设置好的端口号
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * 格式化端口号为整型（非必须）
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * 错误处理（拦截器）
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}

function onRequet() {

}