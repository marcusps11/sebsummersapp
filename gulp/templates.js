'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const watch = require('gulp-watch');
const sources = [
    './src/**/*.html'
];

gulp.task('markup', function() {
    gulp
        .src(sources)
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});

gulp.task('watch-markup', function () {
    watch(sources, function() {
        gulp.start('markup');
    });
});
