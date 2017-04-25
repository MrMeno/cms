routerApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/main');
    $stateProvider
        .state('main', {
            url: '/main',
            views: {
                '': {
                    templateUrl: 'tpls/main.html'
                },
                'bottom@main': {
                    templateUrl: 'tpls/bottom.html'
                },
                'top@main': {
                    templateUrl: 'tpls/top.html',
                    controller: 'topController'
                },
                '@main': {
                    templateUrl: 'tpls/content.html'
                }
            }
        }).state('main.actor', {
            url: '/actor/:id',
            templateUrl: 'tpls/detailActor.html'
        }).state('main.jump', {
            url: '/jump',
            templateUrl: 'tpls/login/jump.html'
        })
        .state('main.drama', {
            url: '/drama/:id',
            templateUrl: 'tpls/detailDrama.html'
        }).state('main.company', {
            url: '/company/:id',
            templateUrl: 'tpls/detailCop.html'
        }).state('main.regist', {
            url: '/regist',
            templateUrl: 'tpls/login/regist.html'
        }).state('main.password', {
            url: '/password',
            templateUrl: 'tpls/login/password.html'
        }).state('main.sign', {
            url: '/sign',
            templateUrl: 'tpls/login/sign.html'
        }).state('main.search', {
            url: '/search/:search',
            templateUrl: 'tpls/search.html'
        }).state('main.customer', {
            url: '/customer',
            templateUrl: 'tpls/customer.html'
        })
        .state('main.notfound', {
            url: '/404',
            templateUrl: 'tpls/common/404.html'
        })
        .state('main.error', {
            url: '/500',
            templateUrl: 'tpls/common/500.html'
        })
        .state('main.about', {
            url: '/about',
            views: {
                '': {
                    templateUrl: 'tpls/brief/about.html'
                },
                'sidebars@main.about': {
                    templateUrl: 'tpls/brief/sidebars.html'
                },
                '@main.about': {
                    templateUrl: 'tpls/brief/us.html'
                }
            }
        }).state('main.about.suggest', {
            url: '/suggest',
            templateUrl: 'tpls/brief/suggest.html'
        }).state('main.about.connect', {
            url: '/connect',
            templateUrl: 'tpls/brief/connect.html'
        }).state('main.about.join', {
            url: '/join',
            templateUrl: 'tpls/brief/join.html'
        }).state('main.about.business', {
            url: '/business',
            templateUrl: 'tpls/brief/business.html'
        }).state('main.about.link', {
            url: '/link',
            templateUrl: 'tpls/brief/link.html'
        })
        .state('main.user', {
            url: '/user',
            views: {
                '': {
                    templateUrl: 'tpls/user/userIndex.html'
                },
                'sidebars@main.user': {
                    templateUrl: 'tpls/user/userSidebars.html'
                },
                '@main.user': {
                    templateUrl: 'tpls/user/userConnect.html'
                }
            }

        }).state('main.user.info', {
            //个人信息
            url: '/info',
            templateUrl: 'tpls/user/info.html'
        }).state('main.user.advisory', {
            //咨询列表
            url: '/advisory',
            templateUrl: 'tpls/user/advisory.html'
        }).state('main.user.connect', {
            //用户中心
            url: '/connect',
            templateUrl: 'tpls/user/userConnect.html'
        }).state('main.user.safety', {
            //安全中心
            url: '/safety',
            templateUrl: 'tpls/user/safety.html'
        });
    $locationProvider.html5Mode(true);
});
