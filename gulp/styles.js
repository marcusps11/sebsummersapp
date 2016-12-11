'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const sources = [
    './src/style/**/*.scss',
    './src/js/**/*.scss'
];

gulp.task('styles', function() {
    gulp
        .src('./src/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/style/'))
        .pipe(connect.reload());
});

gulp.task('watch-sass', function () {
    watch(sources, function() {
        gulp.start('styles');
    });
});
