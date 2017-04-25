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
                          //              var a= JSON.stringify(jqXHR);
                          //              console.log(a);
                          var status;
                          status = jqXHR.status;

                          if (status == 400) {
                              $.prompt("错误请求!", { title: '提示' });
                              return false;
                          }

                          if (status == 404) {
                              $.prompt("请求链接不存在!", { title: '提示' });
                              return false;
                          }

                          if (status == 500) {
                              $.prompt("服务器产生内部错误!", { title: '提示' });
                              return false;
                          }

                          if (status == 502) {
                              $.prompt("服务器暂时不可用!", { title: '提示' });
                              return false;
                          }

                          $("button").button("reset");
                          //错误统一处理方法
                          fn.error(jqXHR, textStatus, errorThrown);
                      },
                      success: function(data, textStatus, jqXHR) {
                          if (data && typeof data == 'object') {
                              res = data;
                          } else if (data && typeof data == 'string') {
                              res = jQuery.parseJSON(data);
                          }
                          if (res.ret == 2001 || res.ret == 2002) {
                              //2001:缺少accessToken;2002:无效的accessToken
                              $.ajax({
                                  type: "POST",
                                  url: "/login/logout",
                                  processData: true,
                                  success: function(data) {
                                      var token = '';
                                      var arr = document.cookie.match(new RegExp("(^| )access_token=([^;]*)(;|$)"));
                                      if (arr != null) {
                                          token = arr[2];
                                          var exp = new Date();
                                          exp.setTime(exp.getTime() - 1);
                                          if (token != null) {
                                              document.cookie = 'access_token' + "=" + token + ";expires=" + exp.toGMTString();
                                          } else {
                                              return
                                          }
                                      } else {
                                          return
                                      }
                                      location.href = "/";

                                      $.prompt("登录过期，请重新登录!", { title: '提示' });
                                  }
                              });
                              return false;
                          }
                          //非法操作,请求没有权限的操作时
                          else if (res.ret == 3001) {
                              $.prompt(res.msg, { title: '提示' });
                              return false;
                          }

                          //错误警告处理(警告、错误需要分开处理 TODO)
                          else if (res.ret == -1 || res.ret == 1) {
                              $.prompt(res.msg, { title: '提示' });
                              return false;
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
