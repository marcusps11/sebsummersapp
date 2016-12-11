'use strict';

const gulp = require('gulp');
const glob = require('glob');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const args = require('yargs');
const modify = require('gulp-modify');
const viewName = args.argv.name || 'defaultApp';

gulp.task('create-new-view', function() {
    gulp
        .src(['./bootstrapping/templates/defaultView/**/*'])
        .pipe(modify({
            fileModifier: function(file, contents) {
                return contents.replace(/{{defaultView}}/g, viewName);
            }
        }))
        .pipe(gulp.dest(`./src/js/view/${viewName}/`))
        .on('end', function() {
            gulp.start('change-dest-view-filenames');
        });
});

gulp.task('inject-route', function() {
    gulp
        .src('./src/js/core/routes.js')
        .pipe(modify({
            fileModifier: (file, contents) => {
                let mutatedContent = injectRouteToArray(contents);

                mutatedContent = appendImportPath(mutatedContent);
                return mutatedContent;
            }
        }))
        .pipe(gulp.dest('./src/js/core/'));


    function injectRouteToArray(contents) {
        const routeArrayRegEx = /\(([^.][\s\S]*?)\)/g;
        let match = routeArrayRegEx.exec(contents)[0];

        match = match.replace(/[\(/)]/g, '');
        match = match.split(',').map(function(dependency) {
            return dependency.trim();
        });

        match.push(`${viewName}Route`);
        match = match.join(',\n    ');

        return contents.replace(routeArrayRegEx, `(\n    ${match}\n)`);
    }

    function appendImportPath(contents) {
        const importPathRegEx = /(^i.*[\s\S]*?';)/;
        let match = importPathRegEx.exec(contents)[0];

        match = match.split('\n');
        match.push(`import ${viewName}Route from '../view/${viewName}/${viewName}.config';`);
        match = match.join('\n');

        return contents.replace(importPathRegEx, match);
    }
});

gulp.task('init-view-controller', function() {
    gulp
        .src('./src/js/core/views.js')
        .pipe(modify({
            fileModifier: (file, contents) => {
                let mutatedContent = appendImportPath(contents);

                mutatedContent = injectCtrlsToArray(mutatedContent);
                mutatedContent = bootstrapCtrls(mutatedContent);

                return mutatedContent;
            }
        }))
        .pipe(gulp.dest('./src/js/core/'));

    function injectCtrlsToArray(contents) {
        const controllerArrayRegEx = /initControllers\(([\s\S]*?)\)/g;
        let match = contents.match(controllerArrayRegEx)[0];

        match = match.replace(/initControllers|[\(/)]/g, '');
        match = match.split(',').map(function(dependency) {
            return dependency.trim();
        });
        match.push(`${viewName}Ctrl`);
        match = match.join(',\n        ');

        return contents.replace(controllerArrayRegEx, `initControllers(\n        ${match}\n    )`);
    }

    function appendImportPath(contents) {
        const importPathRegEx = /(^i.*[\s\S]*?';)/;
        let match = importPathRegEx.exec(contents)[0];

        match = match.split('\n');
        match.push(`import ${viewName}Ctrl from '../view/${viewName}/controller/${viewName}.controller';`);
        match = match.join('\n');

        return contents.replace(importPathRegEx, match);
    }

    function bootstrapCtrls(contents) {
        const bootstrapRegEx = /[\s]\) \{([\s\S]*?)\}/;

        let match = contents.match(bootstrapRegEx)[0];

        match = match.replace(/[{}]/g, '');
        match = match.replace(/[)]/, '');
        match = match.replace(/( )/g, '');
        match = match.split('\n').map((controller) => {
            return controller.trim()
        });
        match.push(`this.app.controller('${viewName}Ctrl', ${viewName}Ctrl);`);
        match = _.compact(match);
        match = match.join('\n        ');

        return contents.replace(bootstrapRegEx, ') \{\n        ' + match + '\n    }');
    }
});

gulp.task('add-view-styles', function() {
    gulp
        .src('./src/style/import/_import-views.scss')
        .pipe(modify({
            fileModifier: (file, contents) => {
                return appendStylesFilePath(contents);
            }
        }))
        .pipe(gulp.dest('./src/style/import/'));

    function appendStylesFilePath(contents) {
        return contents.concat(`@import '../../js/view/${viewName}/style/${viewName}';`);
    }
});

gulp.task('change-dest-view-filenames', function() {
    const sources = `./src/js/view/${viewName}/**/*.*`;
    const isDefault = /default/i;
    const pathsToBeActioned = glob
        .sync(sources)
        .filter((some) => (isDefault.test(some)))
        .map((file) => (path.resolve(file)));

    pathsToBeActioned.forEach((source) => {
        fs.copySync(source, source.replace('default', viewName));
        fs.removeSync(source);
    });
});
