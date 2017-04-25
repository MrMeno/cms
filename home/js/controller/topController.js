routerApp.controller('topController', ['$scope', '$state','$cookieStore',function($scope, $state,$cookieStore) {
  
    $scope.toUserCenter = function() {
        $state.go('main.user');

    };
    $scope.SetCookie = function(name, value,day) //两个参数，一个是cookie的名子，一个是值
        {
           // var Days = 0.0139; //此 cookie 将被保存 20分钟
            var exp = new Date();
            exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }
    $scope.getCookie = function(name) //取cookies函数       
        {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return (arr[2]);
            return null;
        }
    $scope.userName = $scope.getCookie('username');
    $scope.load_params = { userName: $scope.userName, password: '' };
    $scope.access_token = $scope.getCookie('access_token');
    $scope.loadSys = function() {
        $.ajax({
            type: "POST",
            url: "login/login",
            dataType: "json",
            async: false,
            data: $scope.load_params,
            success: function(res) {

                if (res.ret == 0) {
                    $scope.SetCookie('username', $scope.load_params.userName,2);
                    window.location.reload();
                } else {
                    $state.go('main');
                }
            }

        });
    };
    $scope.logout = function() {
        $cookieStore.remove('access_token');
        $.ajax({
            type: "POST",
            url: "login/logout?access_token=" + $scope.access_token,
            dataType: "json",
            async: false,
            success: function(res) {

                if (res.ret == 0) {
                    window.location.reload();
                } else {
                    alert(res.msg);
                }
            }

        });
    }
}]);