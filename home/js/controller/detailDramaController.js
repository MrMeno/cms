routerApp.controller('detailDramaController', ['$scope', '$stateParams', '$state', '$interval', '$rootScope', '$cookieStore',
    function($scope, $stateParams, $state, $interval, $rootScope, $cookieStore) {
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
            $.prompt('登录后即可查看详情', { title: '提示' });
            $state.go('main');
            return false
        } else {
            $scope.SetCookie('access_token', $scope.access_token);
        }
        $scope.hostName = '/home/download?id=';
        $scope.detail_data = [];
        $scope.id = $stateParams.id;
        $scope.loadata = '';
        $scope.ad_params = { name: '', phone: '', dramaId: $scope.id, demand: '', dramaName: '' };
        $scope.load_detail = function() {
            $.ajax({
                type: "GET",
                url: "home/detail/drama/" + $scope.id,
                dataType: "json",
                async: false,
                success: function(res) {
                    if (res.data != null) {
                        $scope.detail_data = res.data;
                    } else {


                    }
                }
            });
        };

        $scope.toDetailCop = function(id) {
            $state.go('main.company', {
                id: id
            });
        };
        $scope.advisory_submit = function() {
            var confirm = true;
            for (var i in $scope.ad_params) {
                if ($scope.ad_params[i] == '') {
                    confirm = false
                }
            };
            if (confirm) {
                $.ajax({
                    type: "POST",
                    url: "home/advisory",
                    dataType: "json",
                    async: false,
                    data: $scope.ad_params,
                    success: function(res) {
                        if (res.ret == 0) {
                            $.prompt("咨询成功", {
                                title: "提示"
                            });
                        } else {
                            $.prompt(res.msg, {
                                title: "提示"
                            });
                        }
                    }
                });
            } else {
                $.prompt('请填写完整信息', { title: '提示' });
            }
        }
        $scope.getTime = function() {
            var myDate = new Date();
            myDate.getYear(); //获取当前年份(2位)
            myDate.getMonth(); //获取当前月份(0-11,0代表1月)
            myDate.getDate(); //获取当前日(1-31)
            myDate.getHours(); //获取当前小时数(0-23)
            myDate.getMinutes(); //获取当前分钟数(0-59)
            myDate.getSeconds(); //获取当前秒数(0-59)
            Date.prototype.Format = function(fmt) { //author: meizz 
                var o = {
                    "M+": this.getMonth() + 1, //月份 
                    "d+": this.getDate(), //日 
                    "h+": this.getHours(), //小时 
                    "m+": this.getMinutes(), //分 
                    "s+": this.getSeconds(), //秒 
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                    "S": this.getMilliseconds() //毫秒 
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            };
            return myDate;
        };

        $scope.checkTime = function(i) { //将0-9的数字前面加上0，例1变为01 
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        $scope.timeCouter = function(Dates) {
            var endDate = new Date(Dates);
            var startDate = $scope.getTime();
            // console.log(startDate);
            //  console.log(endDate);

            if (endDate > startDate) {
                var leftTime = endDate - startDate;
                var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟 
                var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数 
                days = $scope.checkTime(days);
                hours = $scope.checkTime(hours);
                minutes = $scope.checkTime(minutes);
                seconds = $scope.checkTime(seconds);
                var str = "<span class='times'>" + days + "</span>天" +
                    "<span class='times'>" + hours + "</span>时" +
                    "<span class='times'>" + minutes + "</span>分" +
                    "<span class='times'>" + seconds + "</span>秒";
                return str;
            } else {
                var str = "项目已过期";
                return str;
            }
        };
        $scope.promise = $interval($scope.timeCouter(), 1000);
        $scope.load_detail();
    }
]);
