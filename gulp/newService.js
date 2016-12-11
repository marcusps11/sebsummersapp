'use strict';

const gulp = require('gulp');
const args = require('yargs');
const modify = require('gulp-modify');
const _ = require('lodash');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const serviceName = args.argv.name || 'defaultApp';

gulp.task('create-new-module', () => {
    gulp
        .src(['./bootstrapping/templates/defaultService/**/*'])
        .pipe(modify({
            fileModifier: function(file, contents) {
                return contents.replace(/{{defaultService}}/g, serviceName);
            }
        }))
        .pipe(gulp.dest(`./src/js/service/${serviceName}/`))
        .on('end', function() {
            gulp.start('change-dest-service-filenames');
        });
});

gulp.task('append-import-path', () => {
    gulp.src('./src/js/core/services.js')
    .pipe(modify({
        fileModifier: (file, contents) => {
            let mutatedContent = appendImportPath(contents);

            mutatedContent = passDependenciesToBootstrapFunc(mutatedContent);

            return mutatedContent;
        }
    }))
    .pipe(gulp.dest('./src/js/core'));

    function appendImportPath(contents) {
        const importPathRegEx = /(^i.*[\s\S]*?';)/;
        let match = importPathRegEx.exec(contents)

        if (match) {
            match = match[0].split('\n');
            match.push(`import ${serviceName}Service from '../service/${serviceName}/${serviceName}.factory';`);
            match = match.join('\n');
            return contents.replace(importPathRegEx, match);
        } else {
            match = `import ${serviceName}Service from '../service/${serviceName}/${serviceName}.factory';\n\n${contents}`;
            return match;
        }
    }

    function passDependenciesToBootstrapFunc(contents) {
        const routeArrayRegEx = /bootstrapServices\(([^.][\s\S]*?)\)/;
        let match = routeArrayRegEx.exec(contents)[0];
        let isFirstItem;

        match = match.replace(/[\(/)]/g, '');
        match = match.replace('bootstrapServices', '');
        match = match.split(',').map(function(dependency) {
            return dependency.trim();
        });

        isFirstItem = !_.compact(match).length;

        match.push(`${serviceName}Service`);
        match = match.join(isFirstItem ? '' : ',\n            ');

        return contents.replace(routeArrayRegEx, `bootstrapServices(\n            ${match}\n        )`);
    }
});

gulp.task('change-dest-service-filenames', () => {
    const sources = `./src/js/service/${serviceName}/**/*.*`;
    const isDefault = /default/i;
    const pathsToBeActioned = glob
        .sync(sources)
        .filter((some) => (isDefault.test(some)))
        .map((file) => (path.resolve(file)));

    pathsToBeActioned.forEach((source) => {
        fs.copySync(source, source.replace('default', serviceName));
        fs.removeSync(source);
    });
});
