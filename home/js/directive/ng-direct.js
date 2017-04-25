routerApp.directive('onFinishRenderFilters', function($timeout) { 
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});

routerApp.directive('ngEnter', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function($scope, element, attrs, controller) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    $scope.$apply(function() {
                        $scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    }
});



routerApp.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change', function(event){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
        //附件预览
           scope.file = (event.srcElement || event.target).files[0];
        scope.getFile();
      });
    }
  };
}]);


