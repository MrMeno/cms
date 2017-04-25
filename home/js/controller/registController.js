routerApp.controller('registController', ['$scope', '$stateParams', '$state', '$interval', function($scope, $stateParams, $state, $interval) {
    $scope.reg_data = {
        userName: '',
        type: 1,
        nickName: '',
        verification: '',
        password: '',
        repeatPasswd: '',
        email: '',
        level:$scope.level
    };
    $scope.confirm = false;
    $scope.cap_num = '';
    $scope.message_list = {
        phone: [{
            show1: false,
            show2: false,
            msg: ''
        }],
        captcha: [{
            show1: false,
            show2: false,
            msg: ''
        }],
        nick: [{
            show1: false,
            show2: false,
            msg: ''
        }],
        email: [{
            show1: false,
            show2: false,
            msg: ''
        }],
        password: [{
            show1: false,
            show2: false,
            msg: ''
        }],
        reppsw: [{
            show1: false,
            show2: false,
            msg: ''
        }]
    };
    $scope.paracont = "获取验证码";
    $scope.paraclass = "btn btn-default";
    $scope.paraevent = true;
    $scope.second = 60,
    $scope.level='弱',
        $scope.jump_num = 3;
    $scope.timePromise = null;

     $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
           $scope.level=$('#levelc>span').val();
        })

    $scope.getCookie = function(name) //取cookies函数       
        {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return (arr[2]);
            return null;
        }

    $scope.check = function() {
        $scope.confirm = !$scope.confirm;
        return $scope.confirm;
    };
    $scope.SetCookie = function(name, value) //两个参数，一个是cookie的名子，一个是值
        {
            var Days = 0.0139; //此 cookie 将被保存 20分钟
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }
    $scope.loadSys = function() {
        $.ajax({
            type: "POST",
            url: "login/login",
            dataType: "json",
            async: false,
            data: {
                userName: $scope.reg_data.userName,
                password: $scope.reg_data.password
            },
            success: function(res) {
                if (res.ret == 0) {
                    $scope.SetCookie('username', $scope.reg_data.userName);
                    $scope.counter = $interval(function() {
                        if ($scope.jump_num <= 0) {
                            $interval.cancel($scope.counter);
                            $scope.timePromise = undefined;
                            $scope.jump_num = 3;
                            window.location.reload();
                            $state.go('main');
                        } else {
                            $scope.jump_num--;
                        }
                    }, 1000, 4);
                } else {
                    $state.go('main');
                    alert(res.msg);
                }
            }

        });
    };
    $scope.regist = function() {
        var allowRegister = true;
        // for (var t in $scope.message_list) {
        //     if (t.msg == '' || t.msg == null || t.msg == undefined) {
        //         allowRegister = false;
        //     }
        // };
        for (var s in $scope.reg_data) {
            if (s == '' || s == null || s == undefined) {
                allowRegister = false;
            }
        };
        if ($scope.confirm) {
            if (allowRegister) {
                $.ajax({
                    type: "POST",
                    url: "login/regist",
                    dataType: "json",
                    async: false,
                    data: $scope.reg_data,
                    success: function(res) {
                        if (res.ret == 0) {
                            $.prompt("恭喜您，注册成功!", {
                                title: "提示",
                                buttons: { "确定": true },
                                submit: function(e, v, m, f) {
                                    if (v) {
                                        $scope.loadSys();
                                    }
                                }
                            })
                        } else if (res.ret != 0) {
                            $.prompt(res.msg, { title: "提示" });
                        }

                    }
                });

            } else {
                $.prompt("请完善注册信息", { title: "提示" });
            }
        } else {
            $.prompt("请同意注册协议", { title: "提示" });
        }
    };

    $scope.captcha = function() {
        $.ajax({
            type: "POST",
            url: "login/captcha",
            dataType: "json",
            async: false,
            data: {
                userName: $scope.reg_data.userName,
                type: 1
            },
            success: function(res) {
                if (res.ret == 0) {
                    $scope.timePromise = $interval(function() {
                        if ($scope.second <= 0) {
                            $interval.cancel($scope.timePromise);
                            $scope.timePromise = undefined;
                            $scope.second = 60;
                            $scope.paracont = "重发验证码";
                            $scope.paraclass = "btn btn-default";
                            $scope.paraevent = true;
                        } else {
                            $scope.paracont = $scope.second + "秒后可重发";
                            $scope.paraclass = "btn btn-default disabled";
                            $scope.second--;

                        }
                    }, 1000, 61);
                    $scope.cap_num = res.msg;
                    $scope.message_list.phone[0].show2 = true;
                    $scope.message_list.phone[0].show1 = false;
                    $scope.message_list.phone[0].msg = '';

                    // $.prompt("验证码已发送至手机号<a>" + $scope.reg_data.userName + "</a>，请注意查收", { title: "提示" });
                } else {
                    $scope.message_list.phone[0].show1 = true;
                    $scope.message_list.phone[0].show2 = false;
                    $scope.message_list.phone[0].msg = res.msg;
                }
            }
        })
    };

    $scope.passwordLevel = function(password) {
        var pwdArray = new Array();
        var securityLevelFlag = 0;
        if (password.length < 6) {
            return 0;
        } else {
            var securityLevelFlagArray = new Array(0, 0, 0, 0);
            for (var i = 0; i < password.length; i++) {
                var asciiNumber = password.substr(i, 1).charCodeAt();
                if (asciiNumber >= 48 && asciiNumber <= 57) {
                    securityLevelFlagArray[0] = 1; //数字
                } else if (asciiNumber >= 97 && asciiNumber <= 122) {
                    securityLevelFlagArray[1] = 1; //小写
                } else if (asciiNumber >= 65 && asciiNumber <= 90) {
                    securityLevelFlagArray[2] = 1; //大写
                } else {
                    securityLevelFlagArray[3] = 1; //特殊字符
                }
            }

            for (var i = 0; i < securityLevelFlagArray.length; i++) {
                if (securityLevelFlagArray[i] == 1) {
                    securityLevelFlag++;
                }
            }
            return securityLevelFlag;
        }
    };
    $scope.validate = function(type) {
        if (type == 'phone') {
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!reg.test($scope.reg_data.userName)) {
                $scope.message_list.phone[0].show1 = true;
                $scope.message_list.phone[0].show2 = false;
                $scope.message_list.phone[0].msg = '手机号码格式不正确';
            } else {
                $scope.message_list.phone[0].show2 = true;
                $scope.message_list.phone[0].show1 = false;
                $scope.message_list.phone[0].msg = '';

            }
        } else if (type == 'cap') {
            if ($scope.reg_data.verification != $scope.cap_num || $scope.cap_num == '') {
                $scope.message_list.captcha[0].show1 = true;
                $scope.message_list.captcha[0].show2 = false;
                $scope.message_list.captcha[0].msg = '验证码不正确';

            } else {
                $scope.message_list.captcha[0].show2 = true;
                $scope.message_list.captcha[0].show1 = false;
                $scope.message_list.captcha[0].msg = '';

            }
        } else if (type == 'nick') {
            if ($scope.reg_data.nickName == '') {
                $scope.message_list.nick[0].show1 = true;
                $scope.message_list.nick[0].show2 = false;
                $scope.message_list.nick[0].msg = '昵称不能为空';

            } else {
                $scope.message_list.nick[0].show2 = true;
                $scope.message_list.nick[0].show1 = false;
                $scope.message_list.nick[0].msg = '';

            }
        } else if (type == 'email') {
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if (!reg.test($scope.reg_data.email)) {
                $scope.message_list.email[0].show1 = true;
                $scope.message_list.email[0].show2 = false;
                $scope.message_list.email[0].msg = '邮箱格式不正确';

            } else {
                $scope.message_list.email[0].show2 = true;
                $scope.message_list.email[0].show1 = false;
                $scope.message_list.email[0].msg = '';
            }
        } else if (type == 'password') {
            if ($scope.reg_data.password.length < 6) {
                $scope.message_list.password[0].show1 = true;
                $scope.message_list.password[0].show2 = false;
                $scope.message_list.password[0].msg = '密码必须大于6位';
            } else {
                $scope.message_list.password[0].show2 = true;
                $scope.message_list.password[0].show1 = false;
                $scope.message_list.password[0].msg = '';
            }
        } else if (type == 'repeatPasswd') {
            if ($scope.reg_data.password != $scope.reg_data.repeatPasswd) {
                $scope.message_list.reppsw[0].show1 = true;
                $scope.message_list.reppsw[0].show2 = false;
                $scope.message_list.reppsw[0].msg = '密码不一致';
            } else {
                $scope.message_list.reppsw[0].show2 = true;
                $scope.message_list.reppsw[0].show1 = false;
                $scope.message_list.reppsw[0].msg = '';
            }
        }
    };
}]);