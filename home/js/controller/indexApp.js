var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'infinite-scroll', 'mgcrea.ngStrap', 'ngAnimate', 'ngCookies'], function($compileProvider) {
    $compileProvider.directive('compile', function($compile) {
        return function(scope, element, attrs) { //最新重写的绑定事件，可以识别富文本
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    element.html(value, 'utf8');
                    $compile(element.contents())(scope);
                }
            );
        };


    });

});


routerApp.controller('mainCtrller', ['$scope', '$state', '$http', '$interval', '$rootScope', function($scope, $state, $http, $interval, $rootScope) {
    $scope.search_params = { search: '', type: 1 }; //type（0：影视剧名称 1：演员 2：导演 3：编剧）
    $scope.hot_data = [];
    $scope.res_data = [];
    $scope.busy = true;
    $scope.loadCounter = 1;
    $scope.records = 5;
    $scope.loadMore = function() {
        var last = $scope.images[$scope.images.length - 1];
        for (var i = 1; i <= 8; i++) {
            $scope.images.push(last + i);
            $scope.busy = true;
        }
    };
    $scope.setString = function(str, len) {
        if (str != null && str != '') {
            var strlen = 0;
            var s = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 128) {
                    strlen += 2;
                } else {
                    strlen++;
                }
                s += str.charAt(i);
                if (strlen >= len) {
                    return s + "...";
                }
            }
            return s;
        } else {
            return
        }
    }

    $scope.getCookie = function(name) //取cookies函数       
        {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return (arr[2]);
            return null;
        }
    $scope.toDetailDrama = function(id) {
        var access_token = $scope.getCookie('access_token');
        if (access_token == '' || access_token == null || access_token == undefined) {
            $(".bs-example-modal-md").modal();
        } else {
            $state.go('main.drama', {
                id: id
            });
        }

    };
    $scope.showHot = function() {
        var params = $scope.search_params.type;
        $.ajax({
            type: "GET",
            url: "home/hotKey?type=" + params,
            dataType: "json",
            async: false,
            success: function(resquet) {
                if (resquet.data != null) {

                    $scope.hot_data = resquet.data;
                } else {

                }
            }
        });
    }

    $scope.inti_Param = function() {
        $scope.search_params = { search: '', type: 1, releaseEnd: '', releaseBegin: '', dramaTypeId: '' };
        // $scope.load_list();
    };
    $scope.typeSwith = function(params) {
        $scope.search_params.type = params;
        $.ajax({
            type: "GET",
            url: "home/hotKey?type=" + params,
            dataType: "json",
            async: false,
            success: function(resquet) {
                if (resquet.data != null) {

                    $scope.hot_data = resquet.data;
                } else {

                }
            }
        });
    };
    $scope.load_list = function() {
        if ($scope.loadCounter <= $scope.records) {
            var parsm = {
                search: $scope.search_params.search,
                type: $scope.search_params.type,
                rows: 8,
                page: $scope.loadCounter
            };
            $scope.busy = true;
            $.ajax({
                type: "GET",
                url: 'home/drama/solr',
                dataType: "json",
                async: true,
                data: parsm,
                success: function(request) {
                    if (request.data != null && request.data.length != 0) {
                        $scope.loadCounter++;
                        $scope.records = Math.ceil(request.records / 8);
                        for (var i = 0; i < request.data.length; i++) {
                            $scope.res_data.push(request.data[i]);
                        }
                        $scope.busy = false;
                    } else {
                        $scope.busy = true;
                        $scope.result = true;
                    }
                }
            });
        } else {
            $scope.busy = false;
        }
    };
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

    $scope.search = function(search) {
        $state.go('main.search', {
            'search': search
        });
    };
    $scope.thisEnter = function(params) {
        $scope.search(params);
    };
    $scope.load_list();
    $scope.showHot();
    $scope.inti_Param();


    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.more_actor').click(function() {
            var id = $(this).attr('id');
            var pre_span = $('#' + id).prev();
            var inner_a = $(pre_span);

            $(inner_a).addClass('show');
        });
        $('.tab_list').click(function() {

        })
    });

}]);
//detailDrama.html controller

routerApp.controller('signController', ['$scope', '$state', function($scope, $state) {
    $scope.agree = function() {
        $state.go('main.regist');
    }

}]);

routerApp.controller('jumpController', ['$scope', '$state', function($scope, $state) {
    $scope.jump = function() {
        var url = window.location.href;
        var token = url.split('?')[1].split('=')[1];
        $.ajax({
            type: "POST",
            url: "home/user/activate_email?token=" + token,
            dataType: "json",
            async: true,
            success: function(res) {
                if (res.ret == 0) {
                    $.prompt(res.msg, {
                        title: '提示',
                        submit: function(e, v, m, f) {
                            if (v) {
                                $state.go('main');
                            }
                        }
                    });
                    return;
                } else {
                    $.prompt(res.msg, {
                        title: '提示',
                        submit: function(e, v, m, f) {
                            if (v) {
                                $state.go('main');
                            }
                        }
                    });

                }
            }

        });
    }
    $scope.jump();
}]);
