routerApp.controller('searchController', ['$scope', '$stateParams', '$state', '$http', '$interval', '$rootScope', '$compile', '$popover',
    function($scope, $stateParams, $state, $http, $interval, $rootScope, $compile, $popover) {
        $scope.search = $stateParams.search;
        $scope.chose_data = {
            actorsName: '',
            directorsName: '',
            screenwritersName: '',
            type: ''
        };
        $scope.search_params = {
            search: $scope.search,
            actorsName: $scope.chose_data.actorsName,
            directorsName: $scope.chose_data.directorsName,
            screenwritersName: $scope.chose_data.screenwritersName,
            dramaTypeName: $scope.chose_data.dramaTypeName
        };
        $scope.res_data = [];
        $scope.type_list = [];
        $scope.loadCounterSearch = 1;
        $scope.busy_search = true;
        $scope.actor_data = [];
        $scope.writer_data = [];
        $scope.director_data = [];
        $scope.records = 5;

        $scope.intiParams = function() {
            $scope.loadCounterSearch = 1; //重置页码
            $scope.res_data = []; //清空数据
        };
        $scope.enter_search = function() {
            $scope.intiParams();
            $scope.load_list_search();
        }
        $scope.getCookie = function(name) //取cookies函数       
            {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) return (arr[2]);
                return null;
            }
        $scope.addChose = function(name, type) {
            if (type == 'actor') {
                $scope.chose_data.actorsName = name;
                $scope.search_params.actorsName = $scope.chose_data.actorsName;
                $scope.search_params.type = 1;
                $scope.enter_search();
                $scope.$on(function() {
                    $(this).parent().parent().children().children().removeClass('back_change');
                    $(this).addClass('back_change');
                });
            } else if (type == 'director') {
                $scope.chose_data.directorsName = name;
                $scope.search_params.directorsName = $scope.chose_data.directorsName;
                $scope.search_params.type = 2;
                $scope.enter_search();
            } else if (type == 'writer') {
                $scope.chose_data.screenwritersName = name;
                $scope.search_params.screenwritersName = $scope.chose_data.screenwritersName;
                $scope.search_params.type = 3;
                $scope.enter_search();
            } else if (type == 'type') {
                $scope.chose_data.type = name;
                $scope.search_params.dramaTypeName = name;
                $scope.enter_search();
            }
        };
        $scope.delChose = function(name) {
            if (name == 0) {
                $scope.chose_data.type = '';
                $scope.search_params.dramaTypeName = '';
                $scope.enter_search();
            } else if (name == 1) {
                $scope.chose_data.actorsName = '';
                $scope.search_params.actorsName = '';
                $scope.enter_search();
            } else if (name == 2) {
                $scope.chose_data.directorsName = '';
                $scope.search_params.directorsName = '';
                $scope.enter_search();
            } else if (name == 3) {
                $scope.chose_data.screenwritersName = '';
                $scope.search_params.screenwritersName = '';
                $scope.enter_search();
            }
        };
        $scope.getStaff = function() {
            $.ajax({
                type: "GET",
                url: 'home/staff_list?type=1',
                dataType: "json",
                async: false,
                success: function(request) {
                    if (request.data != null && request.data.length != 0) {
                        $scope.actor_data = request.data;

                    } else {

                    }
                }
            });
            $.ajax({
                type: "GET",
                url: 'home/staff_list?type=2',
                dataType: "json",
                async: false,
                success: function(request) {
                    if (request.data != null && request.data.length != 0) {
                        $scope.director_data = request.data;
                    } else {

                    }
                }
            });
            $.ajax({
                type: "GET",
                url: 'home/staff_list?type=3',
                dataType: "json",
                async: false,
                success: function(request) {
                    if (request.data != null && request.data.length != 0) {
                        $scope.writer_data = request.data;
    
                    } else {

                    }
                }
            });
        };

        $scope.load_list_search = function() {
            if ($scope.loadCounterSearch <= $scope.records) {
                var parsm = {
                    search: $scope.search_params.search,
                    actorsName: $scope.search_params.actorsName,
                    directorsName: $scope.search_params.directorsName,
                    screenwritersName: $scope.search_params.screenwritersName,
                    rows: 8,
                    dramaTypeName: $scope.search_params.dramaTypeName,
                    page: $scope.loadCounterSearch
                };
                $scope.busy_search = true;
                $.ajax({
                    type: "GET",
                    url: 'home/drama/solr',
                    dataType: "json",
                    async: true,
                    data: parsm,
                    success: function(request) {
                        if (request.data != null && request.data.length != 0) {
                            $scope.loadCounterSearch++;
                            $scope.records = Math.ceil(request.records / 8);
                            for (var i = 0; i < request.data.length; i++) {
                                $scope.res_data.push(request.data[i]);
                            }
                            $scope.busy_search = false;
                        } else {
                            $scope.busy_search = true;
                            $scope.result = true;
                        }
                    }
                });
            } else {
                $scope.busy_search = false;
            }
        };

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
        };
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

        $scope.load_type = function() {
            $.ajax({
                type: "GET",
                url: 'home/load_type',
                dataType: "json",
                async: false,
                success: function(request) {
                    if (request.data != null) {
                        $scope.type_list = request.data;

                    } else {

                    }
                }
            });
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
                return;
            }
        }

        $scope.noFlict = function(e) {
            $scope.search_params.dramaTypeName = '';
            $scope.chose_data.type='';
            $scope.intiParams();
            $scope.load_list_search();
        }

        $scope.load_list_search();
        $scope.load_type();
        $scope.getStaff();
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $('.basic_list li>span').click(function() {
                var spans = $(this).parent().parent().children().children();
                spans.css('color', '#333');
                spans.removeClass('back_change');
                $(this).addClass('back_change');
                $(this).css('color', '#4b8ccb');
            });

        });
    }
]);
