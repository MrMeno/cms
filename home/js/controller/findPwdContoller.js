routerApp.controller('findpwController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
    $scope.userName = '';
    $scope.verification = '';
    $scope.next = true;
    $scope.tokens = '';
    $scope.password = '';
    $scope.newpassWd = '';

    $scope.captcha = function() {
        $.ajax({
            type: "POST",
            url: "login/captcha",
            dataType: "json",
            async: false,
            data: {
                userName: $scope.userName,
                type: 2
            },
            success: function(res) {
                if (res.ret == 0) {
                    $.prompt("验证码已发送至手机号<a>" + $scope.userName + "</a>，请注意查收", {
                        title: "提示"
                    });
                } else {
                    $.prompt(res.msg, {
                        title: "提示"
                    });
                }
            }
        });
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

    $scope.checkVerification = function() {
        $.ajax({
            type: "POST",
            url: "login/checkVerification",
            dataType: "json",
            async: false,
            data: {
                userName: $scope.userName,
                verification: $scope.verification
            },
            success: function(res) {
                if (res.ret == 0) {
                    $scope.tokens = res.msg;
                    $scope.next = false;
                } else {
                    $.prompt(res.msg, {
                        title: "提示"
                    });
                }
            }
        });
    };

    $scope.resetPsw = function() {

        var data = {
            userName: $scope.userName,
            password: $scope.password,
            repeatPasswd: $scope.newpassWd,
            level:'弱'
        };
        if ($scope.password == $scope.newpassWd) {
            var thisLevel=$scope.passwordLevel($scope.password);
            if(thisLevel==0||thisLevel==1){
                thisLevel='弱';
            }
            else if(thisLevel==2||thisLevel==3){
                thisLevel='中';
            }
            else if(thisLevel==4){
                data='强';
            }
            data.level=thisLevel;
            $.ajax({
                type: "POST",
                url: "login/resetPassword?token=" + $scope.tokens,
                dataType: "json",
                async: false,
                data: data,
                success: function(res) {

                    if (res.ret == 0) {
                        $scope.tokens = res.msg;
                        $.prompt('密码修改成功,请重新登录', {
                            title: "提示",
                            buttons: {
                                "确定": true
                            },
                            submit: function(e, v, m, f) {
                                if (v) {
                                    $state.go('main');
                                }
                            }
                        });


                    } else {
                        $.prompt(res.msg, {
                            title: "提示"
                        });
                    }
                }
            });
        } else {
            $.prompt('密码不一致，请重新输入', {
                title: "提示"
            });
            $scope.password = '';
            $scope.newpassWd = '';
        }
    };
}]);