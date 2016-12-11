'use strict';

const gulp = require('gulp');

require('./gulp/styles');
require('./gulp/scripts');
require('./gulp/templates');
require('./gulp/newModule');
require('./gulp/newView');
require('./gulp/newService');
require('./gulp/liveReload');

gulp.task('live-reload', [
    'connect'
]);

gulp.task('module', [
    'inject-module',
    'append-import-path',
    'add-module-styles',
    'create-new-module'
]);

gulp.task('view', [
    'inject-route',
    'init-view-controller',
    'add-view-styles',
    'create-new-view'
]);

gulp.task('service', [
    'append-import-path',
    'create-new-module'
]);

gulp.task('default', [
    'build-scripts',
    'styles',
    'markup',
    'watch-sass',
    'watch-scripts',
    'watch-markup',
    'live-reload'
]);

gulp.task('dist', [
    'build-scripts',
    'styles',
    'markup'
]);
