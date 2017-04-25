routerApp.controller('detailCopController', ['$scope', '$stateParams', '$state', function($scope, $rootScope, $stateParams, $state) {
    $scope.cop_data = [];
    $scope.load_detail = function() {
        $scope.id = $stateParams.params.id;
        $.ajax({
            type: "GET",
            url: "home/company/" + $scope.id,
            dataType: "json",
            async: false,
            success: function(res) {
                if (res.data != null) {
                    $scope.cop_data = res.data;
                   
                } else {

                }
            }
        });
    }

    $scope.load_detail();
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        var sliders = $('#marquee').bxSlider({
            mode: 'horizontal',
            slideWidth: 140,
            // moveSlides: 5,
            minSlides: 5,
            maxSlides: 6,
            slideMargin: 10,
            pager: false,
            controls: true,
            auto: true,
            prevText: '<',
            nextText: '>',
            wrapperClass: 'wrappers'
        });
    })

}]);