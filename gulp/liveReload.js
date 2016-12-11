'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const history = require('connect-history-api-fallback');

gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        port: 9933,
        livereload: true,
        middleware: (connect, opt) => {
            return [ history({}) ];
        }
    });
});
