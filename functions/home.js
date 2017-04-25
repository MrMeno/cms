var express = require('express');
var router = express.Router();
var http = require('http');
var util = require('util');
var buffer = require('buffer');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var fs = require('fs');
var stringDecoder = require('string_decoder').StringDecoder;

router.get('/load_banner', function(req, res, next) { //获取该用户的企业ID
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/banner/list',
            method: 'GET',
            headers: getheaders,
        };
        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).get('/load_area', function(req, res, next) { //获取该用户的企业ID
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/drama/area_list',
            method: 'GET',
            headers: getheaders,
        };
        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();

    }).post('/advisory', function(req, res, next) {
        var token = req.cookies.access_token;
        var reqJosnData = JSON.stringify(req.body);

        var method = 'POST';
        // 接收客户端的JSON数据  
        // do a POST request  
        var postheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
        };

        // the post options  
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/advisory?access_token=' + token,
            method: method,
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
        reqPost.on('error', function(e) {});
    }).get('/user/advisory/list/', function(req, res, next) {
        //获取咨询列表
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var params = '&page=' + req.query.page + '&rows=' + req.query.rows;
        var token = req.cookies.access_token;

        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/advisory/list?access_token=' + token + params,
            method: 'GET',
            headers: getheaders,
        };
        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).delete('/user/advisory', function(req, res, next) {
        var id = req.query.id;
        var token = req.cookies.access_token;
        var method = 'delete';
        // do a POST request  
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/advisory/' + id + '?access_token=' + token,
            method: method
        };

        // do the POST call  
        var reqPost = http.request(optionspost, function(resPost) {
            resPost.on('data', function(d) {
                res.send(d);
            });
        });

        // write the json data  
        reqPost.end();
        reqPost.on('error', function(e) {});
    }).get('/load_type', function(req, res, next) {
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/drama/type_list',
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).get('/load_staff', function(req, res, next) { //
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/staff/list',
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).get('/drama/list', function(req, res, next) {
        var reqData = req.query;
        var param = '&page=' + reqData.page;
        if (reqData.rows != null && reqData.rows != '') {
            param += '&rows=' + encodeURI(reqData.rows, "UTF-8");
        }
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/drama/list',
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).get('/drama/solr', function(req, res, next) {
        var token = req.cookies.access_token;
        var reqData = req.query;
        var param = '?page=' + reqData.page;
        if (reqData.rows != null && reqData.rows != '') {
            param += '&rows=' + encodeURI(reqData.rows, "UTF-8");
        }
        if (reqData.search != null && reqData.search != '') {
            param += '&search=' + encodeURI(reqData.search, "UTF-8");
        }
        if (reqData.type != null && reqData.type != '') { //type（0：影视剧名称 1：演员 2：导演 3：编剧）
            param += '&type=' + encodeURI(reqData.type, "UTF-8");
        }
        if (reqData.actorsName != null && reqData.actorsName != '') {
            param += '&actorsName=' + encodeURI(reqData.actorsName, "UTF-8");
        }
        if (reqData.directorsName != null && reqData.directorsName != '') {
            param += '&directorsName=' + encodeURI(reqData.directorsName, "UTF-8");
        }
        if (reqData.screenwritersName != null && reqData.screenwritersName != '') {
            param += '&screenwritersName=' + encodeURI(reqData.screenwritersName, "UTF-8");
        } if (reqData.dramaTypeName != null && reqData.dramaTypeName != '') {
            param += '&dramaTypeName=' + encodeURI(reqData.dramaTypeName, "UTF-8");
        }
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'ip_address': req.hostname
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/drama/solr' + param + '&access_token=' + token,
            method: 'GET',
            headers: getheaders,
        };
        var str = '';
        var decoder = new stringDecoder('UTF-8');
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += decoder.write(data);
            });
            response.on('end', function() {
                res.send(str);
            });

        }).end();
    })
    .get('/detail/drama/:id', function(req, res, next) {
        var param = req.params.id;
        var token = req.cookies.access_token;
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/drama/' + param + '?access_token=' + token,
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        var decoder = new stringDecoder('UTF-8');
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += decoder.write(data);
            });
            response.on('end', function() {
                res.send(str);
            });

        }).end();
    }).get('/staff/:id', function(req, res, next) {
        var param = req.params.id;
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/staff/' + param,
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;

            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).get('/company/:id', function(req, res, next) {
        var param = req.params.id;
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/company/' + param,
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        var decoder = new stringDecoder('UTF-8');
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += decoder.write(data);
            });
            response.on('end', function() {
                res.send(str);
            });

        }).end();
    }).get('/staff_list', function(req, res, next) {
        var type = req.query.type;
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/staff/list?type=' + type,
            method: 'GET',
            headers: getheaders,
        };
        console.log(optionspost.path);

        var str = '';
         var decoder = new stringDecoder('UTF-8');
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += decoder.write(data);
            });
            response.on('end', function() {
                res.send(str);
            });

        }).end();
    }).get('/staff_hot', function(req, res, next) {
        var param = req.query.isHot;
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'ip_address': req.hostname
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/staff/list?isHot=' + param,
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).get('/hotKey', function(req, res, next) {
        var param = req.query.type;
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'ip_address': req.hostname
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/hotKeyword/list?type=' + param,
            method: 'GET',
            headers: getheaders,
        };

        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).post('/get_validate/:phone', function(req, res, next) {

        var reqJosnData = JSON.stringify(req.body);

        var method = 'POST';
        var postheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
        };

        // the post options  
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/captcha',
            method: method,
            headers: postheaders
        };

        // do the POST call  
        var reqPost = http.request(optionspost, function(resPost) {
            resPost.on('data', function(d) {
                res.send(d);
            });
        });
        reqPost.write(reqJosnData);
        reqPost.end();
        reqPost.on('error', function(e) {});
    }).post('/upload', multipartMiddleware, function(req, res, next) {
        var token = req.cookies.access_token;
        var files = req.files.image;
        var boundaryKey = Math.random().toString(16);
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/upload/picture?access_token=' + token,
            method: 'POST'
        };
        var reqPost = http.request(optionspost, function(resPost) {
            resPost.on('data', function(d) {
                res.send(d);
            });
        });

        var payload = '--' + boundaryKey + '\r\n' + 'Content-Type: image/jpeg\r\n' + 'Content-Disposition: form-data; name="image"; filename="' + files.name + '"\r\n' + 'Content-Transfer-Encoding: binary\r\n\r\n';

        var enddata = '\r\n--' + boundaryKey + '--';
        reqPost.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundaryKey + '');
        reqPost.setHeader('Content-Length', Buffer.byteLength(payload) + Buffer.byteLength(enddata) + files.size);
        reqPost.write(payload);
        var fileStream = fs.createReadStream(files.path, { bufferSize: 4 * 1024 });
        fileStream.pipe(reqPost, { end: false });

        fileStream.on('end', function(d) {

            reqPost.end(enddata);
        });
        fileStream.on('close', function(d) {

        });

        reqPost.on('error', function(e) {

        });
    }).get('/download', function(req, res, next) {
         var token = req.cookies.access_token;
        var param = req.query.id;
        var getheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'ip_address': req.hostname
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/downLoad/attractInvestment/'+param+'?access_token=' + token,
            method: 'GET',
            headers: getheaders,
        };

        var internalReq = http.request(optionspost, function(internalRes) {
            res.setHeader("Content-Disposition", "attachment;");
            res.writeHead(internalRes.statusCode, internalRes.headers);
            internalRes.pipe(res);
        });
        internalReq.end();

    }).get('/user/user_info', function(req, res, next) {
        //用户信息查询
        var token = req.cookies.access_token;
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/userInfo?access_token=' + token,
            method: 'GET'
        };

        var str = '';
        http.request(optionspost, function(response) {
            response.on('data', function(data) {
                str += data;
            });
            response.on('end', function() {
                res.send(str);
            });
        }).end();
    }).post('/user/user_post_info', function(req, res, next) {
        //user info update 
        var token = req.cookies.access_token;
        var reqJosnData = JSON.stringify(req.body);
        var postheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
        };
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/userInfo?access_token=' + token,
            method: 'POST',
            headers: postheaders
        };
        // do the POST call  
        var reqPost = http.request(optionspost, function(resPost) {
            resPost.on('data', function(d) {
                res.send(d);
            });
        });

        // 发送REST请求时传入JSON数据  
        reqPost.write(reqJosnData);
        reqPost.end();
        reqPost.on('error', function(e) {});
    }).post('/user/send_activate_email/', function(req, res, next) {
        //邮件重新发送
        var token = req.cookies.access_token;
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/userInfo/sendActivateEmail?access_token=' + token,
            method: 'POST'
        };

        // do the POST call  
        var reqPost = http.request(optionspost, function(resPost) {
            resPost.on('data', function(d) {
                res.send(d);
            });
        });

        // 发送REST请求时传入JSON数据  
        reqPost.end();
        reqPost.on('error', function(e) {});
    }).post('/user/activate_email', function(req, res, next) {
        //邮箱激活
        var token = req.cookies.access_token;
        var emailToken = req.query.token;
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/userInfo/emailActivate?access_token=' + token + '&email_token=' + emailToken,
            method: 'POST'
        };

        // do the POST call  
        var reqPost = http.request(optionspost, function(resPost) {
            resPost.on('data', function(d) {
                res.send(d);
            });
        });
        // 发送REST请求时传入JSON数据  
        // reqPost.write(reqJosnData);
        reqPost.end();
        reqPost.on('error', function(e) {});
    }).post('/user/change_email/', function(req, res, next) {
        //重新绑定邮箱
        var email = req.query.email;
        var token = req.cookies.access_token;
        var reqJosnData = JSON.stringify({
            'email': email
        });
        // 接收客户端的JSON数据  
        // do a POST request  
        var postheaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(reqJosnData, 'utf8')
        };

        // the post options  
        var optionspost = {
            host: global.hostAddress,
            port: global.portNum,
            path: global.ctx + '/userInfo/changeEmail?access_token=' + token,
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
        reqPost.on('error', function(e) {});
    });
module.exports = router;
