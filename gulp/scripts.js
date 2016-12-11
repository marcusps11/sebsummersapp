'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const watch = require('gulp-watch');
const babelify = require('babelify');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const modify = require('gulp-modify');

gulp.task('build-scripts', function() {
    gulp.start('babelify');
});

gulp.task('replace-string-paths', function() {
    gulp
        .src('./dist/js/app.js')
        .pipe(modify({
            fileModifier: function(file, contents) {
                const modified = contents.replace(/\/src\//g, '/');

                return modified;
            }
        }))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(connect.reload());
});

gulp.task('babelify', function() {
    const bundler = browserify('./src/js/app.js', {
        debug :true
    });

    const output = bundler.transform(babelify, {
      presets: ['es2015']
    }).bundle()
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'))
        .on('end', function() {
            gulp.start('replace-string-paths');
        });
});

gulp.task('watch-scripts', function() {
    watch('./src/js/**/*.js', function() {
        gulp.start('build-scripts');
    });
});
