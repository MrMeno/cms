/**
 * zhouliangjun
 * 2015-8-16
 */

//Ajax请求封装
(function(window, document, $, undefined) {
    var _ajax = $.ajax;
    // 重写JQuery的Ajax方法
    $.ajax = function(opt) {
        // 备份option中error和success方法
        var fn = {
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data, textStatus, jqXHR) {}
        };
        if (opt.error) {
            fn.error = opt.error;
        }
        if (opt.success) {
            fn.success = opt.success;
        }
        // 拓展统一处理
        var _opt = $.extend(opt, {
            error: function(jqXHR, textStatus, errorThrown) {
                //           	var a= JSON.stringify(jqXHR);
                //            	console.log(a);
                var status;
                status = jqXHR.status;

                if (status == 400) {
                    Dialog.danger("错误请求!");
                    return false;
                }

                if (status == 404) {
                    Dialog.warning("请求链接不存在!");
                    return false;
                }

                if (status == 500) {
                    Dialog.danger("服务器产生内部错误!");
                    return false;
                }

                if (status == 502) {
                    Dialog.danger("服务器暂时不可用!");
                    return false;
                }

                $("button").button("reset");
                //错误统一处理方法
                fn.error(jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR) {

                if (data && typeof data == 'string') {
                    //当nodejs端access_token过期后,执行ajax请求时会返回登录页面的html的处理
                    if (data.match("<!DOCTYPE html>")) {
                        location.href = "/";
                        return false;
                    }
                    //当nodejs端access_token没有过期,而服务端redis中access_token消失不存在时的处理
                    res = jQuery.parseJSON(data);
                    if (res.ret == 2001 || res.ret == 2002) {
                        //2001:缺少accessToken;2002:无效的accessToken
                        $.ajax({
                            type: "POST",
                            url: "/login/logout",
                            processData: true,
                            success: function(data) {
                                location.href = "/";
                                
                            }
                        });
                        return false;
                    }
                    //非法操作,请求没有权限的操作时
                    else if (res.ret == 3001) {
                        Dialog.danger(res.msg);
                        return false;
                    }

                    //错误警告处理(警告、错误需要分开处理 TODO)
                    else if (res.ret == -1 || res.ret == 1) {
                        alert(res.msg);
                        Dialog.danger(res.msg);
                        return false;
                    }
                }
                fn.success(data, textStatus, jqXHR);
            },
            beforeSend: function(XHR) {

            },
            complete: function(XHR, TS) {

            }
        });
        // Important
        return _ajax(_opt);
    };

})(window, document, window.jQuery);

(function($, window, document) {

    var containers = {},
        messages = {},

        notify = function(options) {

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? { status: arguments[1] } : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll = function(group, instantly) {
            if (group) {
                for (var id in messages) {
                    if (group === messages[id].group) messages[id].close(instantly);
                }
            } else {
                for (var id in messages) {
                    messages[id].close(instantly);
                }
            }
        };

    var Message = function(options) {

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
        this.element = $([
            // alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>' + this.options.message + '</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-' + this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function() {
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({
                "opacity": 0,
                "margin-top": -1 * this.element.outerHeight(),
                "margin-bottom": 0,
                "position": 'fixed',
                "top": '45px',
                "right": 0,
                'width': '20%',
                'z-index': 99999999

            }).animate({ "opacity": 1, "margin-top": 0, "margin-bottom": marginbottom }, function() {

                if ($this.options.timeout) {

                    var closefn = function() {
                        $this.close();
                    };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() {
                            clearTimeout($this.timeout);
                        },
                        function() {
                            $this.timeout = setTimeout(closefn, $this.options.timeout);
                        }
                    );
                }

            });

            return this;
        },

        close: function(instantly) {

            var $this = this,
                finalize = function() {
                    $this.element.remove();

                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if (this.timeout) clearTimeout(this.timeout);

            if (instantly) {
                finalize();
            } else {
                this.element.animate({
                    "opacity": 0,
                    "margin-top": -1 * this.element.outerHeight(),
                    "margin-bottom": 0
                }, function() {
                    finalize();
                });
            }

            if (typeof $this.options.callback == "function") {
                $this.options.callback();
            }
        },

        content: function(html) {

            var container = this.element.find(">div");

            if (!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function(status) {

            if (!status) {
                return this.currentstatus;
            }

            this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 2000,
        group: null,
        pos: 'top-center',
        callback: function() {}
    };


    $["notify"] = notify;
    $["notify"].message = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}(jQuery, window, document));


var Main = function() {

    var handleMain = function() {

        //退出登录
        $("#logout").live("click", function() {
            $.ajax({
                type: "POST",
                url: "/login/logout",
                processData: true,
                success: function(data) {
                    location.href = "/";
                }
            });
        });

        // 获取浏览器指定url参数
        $.getUrlParam = function(paras) {
            var url = location.href;
            var paraString = url.substring(url.indexOf("?") + 1, url.length)
                .split("&");
            var paraObj = {};
            for (var i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j
                    .substring(j.indexOf("=") + 1, j.length);
            }
            var returnValue = paraObj[paras.toLowerCase()];
            if (typeof(returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        };

        // 日期格式化
        Date.prototype.format = function(format) {
            /*
             * format="yyyy-MM-dd hh:mm:ss";
             */
            var o = {
                "M+": this.getMonth() + 1, // month
                "d+": this.getDate(), // day
                "h+": this.getHours(), // hour
                "m+": this.getMinutes(), // minute
                "s+": this.getSeconds(), // second
                "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
                "S": this.getMilliseconds()
                    // millisecond
            };

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                        .substr(("" + o[k]).length));
                }
            }
            return format;
        };
    };

    // 处理页面头部消息
    var handleNotice = function() {

        // 获取消息
        $.getNotice = function() {
            $.ajax({
                type: "GET",
                url: "notice/noticeUserInfo",
                processData: true,
                success: function(data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.ret == '0') {
                        var newCount = obj.data.newCount;
                        $("#badge-default").text(newCount);
                        $("#pendingNotice").text(newCount);
                        if (obj.data.noticeList != null) {
                            var html = '';
                            for (var i in obj.data.noticeList) {
                                var title = obj.data.noticeList[i].title == null ? '' : obj.data.noticeList[i].title,
                                    id = obj.data.noticeList[i].id == null ? '' : obj.data.noticeList[i].id,
                                    createDateTime = obj.data.noticeList[i].createDateTime == null ? '' : obj.data.noticeList[i].createDateTime,
                                    link = obj.data.noticeList[i].link == null ? '' : obj.data.noticeList[i].link,
                                    content = obj.data.noticeList[i].content == null ? '' : obj.data.noticeList[i].content,
                                    type = obj.data.noticeList[i].type == null ? '' : obj.data.noticeList[i].type;
                                flag = obj.data.noticeList[i].flag == null ? '' : obj.data.noticeList[i].flag;
                                html += '<li><a id=viewNotice href="javascript:void(0);" data-id=' + id + ' data-type=' + type + '><span class="time">' + title + '</span>';
                                html += '<span class="details">';
                                if (flag == 1) {
                                    html += '<span class="label label-sm label-icon label-success">';
                                    html += '<i class="fa fa-plus"></i>';
                                } else if (flag == 2) {
                                    html += '<span class="label label-sm label-icon label-warning">';
                                    html += '<i class="fa fa-bell-o"></i>';
                                }
                                html += '</span>' + title + '</span></a></li>';
                            }
                            $('#dropdown-menu-list').html(html);
                        } else {
                            $('#dropdown-menu-list').html('没有消息');
                        }
                    }
                }
            });
        };

        $.getNotice();
        // 轮询，查询页面头部消息
        //		setInterval(function() {
        //			$.getNotice();
        //		}, 10000);

        //点击查看消息通知
        $("#viewNotice").live("click", function() {
            var type = $(this).attr("data-type");
            var id = $(this).attr("data-id");
            $.ajax({
                type: "POST",
                url: "/notice/update",
                processData: true,
                data: {
                    type: type,
                    id: id
                },
                success: function(data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.ret == '0') {
                        $.getNotice();
                    }
                }
            });
        });
    };

    return {
        // main function to initiate the module
        init: function() {
            handleMain();
            handleNotice();
        }
    };
}();