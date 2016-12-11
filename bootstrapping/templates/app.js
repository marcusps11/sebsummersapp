'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';

import AppDependencies from './core/dependencies';
import Router from './core/router';
import moduleBootstrapper from './core/modules';
import serviceBootstrapper from './core/services';

const app = angular.module('{{appName}}', AppDependencies);
const router = new Router(app);

app.config([
    '$locationProvider',
    '$stateProvider',
function(
    $locationProvider,
    $stateProvider
) {

    $locationProvider.html5Mode({
        enabled: true
    });

    $locationProvider.hashPrefix('!');
}]);

router.init();
serviceBootstrapper.init(app);
moduleBootstrapper.init();

export default app;
