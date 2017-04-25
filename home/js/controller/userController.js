routerApp.controller('userController', ['$scope', '$stateParams', '$state', '$compile', '$rootScope', '$cookieStore',
    function($scope, $stateParams, $state, $compile, $rootScope, $cookieStore) {
        $scope.SetCookie = function(name, value) //两个参数，一个是cookie的名子，一个是值
            {
                var Days = 0.0139; //此 cookie 将被保存 20分钟
                var exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            }
        $scope.getCookie = function(name) //取cookies函数       
            {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) return (arr[2]);
                return null;
            }
        $scope.access_token = $scope.getCookie('access_token');
        if ($scope.access_token == undefined || $scope.access_token == '' || $scope.access_token == null) {
            $.prompt('未登录或登录已过期，请重新登录', { title: '提示' });
            $state.go('main');
            return
        } else {
            $scope.SetCookie('access_token', $scope.access_token);
        }


        $scope.user_data = [];
        $scope.advisory_list_data = [];
        $scope.page = 1;
        $scope.row = 6;
        $scope.email = '';
        $scope.counters = 1;
        $scope.load_user_info = function() {
            $.ajax({
                type: "GET",
                url: "home/user/user_info",
                dataType: "json",
                async: false,
                success: function(res) {
                    if (res.data != null) {
                        $scope.user_data = res.data;
                        $scope.email = $scope.user_data.email;

                    } else {

                    }
                }
            });
        };

        $scope.pager = function(e) {
            if (e != 'pre' && e != 'next') {
                $scope.page = e;
                $scope.load_advisory();

            } else {
                if (e == 'pre') {
                    $scope.page--;
                    if ($scope.page >= 1) {
                        $scope.load_advisory();
                    } else {
                        $scope.page = 1;
                    }

                } else if (e == 'next') {
                    $scope.page++;
                    if ($scope.page <= $scope.counters) {
                        $scope.load_advisory();
                    } else {
                        $scope.page = $scope.counters;
                        $scope.load_advisory();
                    }
                }
            }

        };

        $scope.load_advisory = function() {
            $.ajax({
                type: "GET",
                url: "home/user/advisory/list?page=" + $scope.page + "&rows=" + $scope.row,
                dataType: "json",
                async: false,
                success: function(res) {
                    if (res.data != null) {
                        $scope.advisory_list_data = res.data;
                        $scope.counters = Math.ceil(res.records / 6);

                    } else {

                    }
                }
            });
        };

        $scope.showPager = function(e) {

            if ($scope.counters >= e) {
                return true;
            } else {
                return false
            }
        };


        $scope.delAdvisory = function(id) {
            $.prompt('是否删除', {
                title: '提示',
                buttons: { '确认': true, '取消': false },
                submit: function(e, v, m, f) {
                    if (v) {
                        $.ajax({
                            type: "delete",
                            url: "home/user/advisory?id=" + id,
                            dataType: "json",
                            async: false,
                            success: function(res) {
                                if (res.ret == 0) {
                                    $.prompt(res.msg, { title: '提示' });
                                    $scope.load_advisory();


                                } else {
                                    $.prompt(res.msg, { title: '提示' });

                                }
                            }
                        });
                    }

                }
            });

        };
        $scope.replaceNum = function(phone) {
            if (phone != null && phone != '' && phone != undefined) {
                var pre = phone.substr(0, 3);
                var next = phone.substr(7);
                var newphone = pre + '****' + next;
                return newphone;
            } else {
                return ''
            }

        };

        //设置邮箱
        $scope.setUserMail = function(id) {
            if ($scope.user_data.emailStatus != 0) {
                var input = "<div class='row' style='overflow-x:hidden;width:100%'>" +
                    "<div class='col col-md-4 text-right'>邮箱：</div>" +
                    "<div class='col col-md-8 text-left'>" +
                    "<input type='text'style='text-align:left' class='form-control' name='email' id='email'  value='" + $scope.email + "' /></div></div>";
                // input=$compile(input)($scope);
                $.prompt(input, {
                    title: "设置邮箱",
                    submit: function(e, v, m, f) {
                        if (v) {
                            if ($scope.user_data.email == null) {
                                $.prompt('邮箱不能为空', { title: '提示' });
                            } else {
                                $.ajax({
                                    type: "POST",
                                    url: "home/user/change_email?email=" + $("#email").val(),
                                    dataType: "json",
                                    async: false,
                                    success: function(res) {
                                        if (res.ret == 0) {
                                            $scope.email = $('#email').val();
                                            $.prompt('邮箱修改成功', { title: '提示' });
                                           $scope.user_data.emailStatus=0;
                                        } else {
                                            $.prompt('邮箱修改失败', { title: '提示' });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                $scope.sendEmail();
            }
        };

        //save user info 
        $scope.saveUser = function() {
            $.ajax({
                type: "POST",
                url: "home/user/user_post_info",
                dataType: "json",
                async: false,
                data: $scope.user_data,
                success: function(res) {
                    if (res.ret == 0) {
                        $.prompt(res.msg, {
                            title: "提示"
                        });
                    } else if (res.ret == '-1') {
                        $.prompt(res.msg, {
                            title: "提示"
                        });
                    }
                }
            });
        };

        //upload user pic 
        $scope.setUserPic = function(id) {
            var input = "<form id='formload' style='text-align:center;padding-left:100px'><input name='image' id='upfile' type='file'><br></form>";
            input = input + "<span style='font-size:10px;color:#d9bc34'>支持JPG/BMP/PNG,大小不超过200KB<br></span>";
            $.prompt(input, {
                title: "设置头像",
                buttons: { '提交': true },
                submit: function(e, v, m, f) {
                    if (v) {
                        var formdata = new FormData();
                        var fileinfo = $('#upfile')[0].files[0];

                        if (fileinfo.size && fileinfo.size > 204800) {
                            $.prompt('图片必须小于200KB', {
                                title: "提示"
                            });
                        } else {
                            var path = fileinfo.name.split('.')[1].toLowerCase();
                            if (path != 'png' && path != 'jpg' && path != 'bmp') {
                                $.prompt('仅支持PNG/JPG/BMP格式的图片', {
                                    title: "提示"
                                });
                            } else {
                                formdata.append('image', fileinfo);
                                $.ajax({
                                    type: "POST",
                                    url: "home/upload",
                                    dataType: "json",
                                    async: false,
                                    data: formdata,
                                    processData: false,
                                    contentType: false,
                                    success: function(res) {
                                        if (res.ret == 0) {
                                            $.prompt('头像上传成功', {
                                                title: "提示",
                                                buttons: { '确认': true },
                                                submit: function() {
                                                    $('.headUrl').attr('src', res.file_path);
                                                }
                                            });

                                        }
                                    }

                                })

                            }
                        }



                    }
                }
            });
        };


        //send user email
        $scope.sendEmail = function() {

            $.ajax({
                type: "POST",
                url: "home/user/send_activate_email",
                dataType: "json",
                async: false,
                success: function(res) {
                    if (res.ret == 0) {
                        $.prompt(res.msg, {
                            title: "提示"
                        });
                    } else if (res.ret == '-1') {
                        $.prompt(res.msg, {
                            title: "提示"
                        });
                    }
                }
            });
        };
        $scope.load_user_info();
        $scope.load_advisory();


    }
]);
