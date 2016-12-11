'use strict';

const gulp = require('gulp');
const args = require('yargs');
const modify = require('gulp-modify');
const _ = require('lodash');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const moduleName = args.argv.name || 'defaultApp';

gulp.task('create-new-module', () => {
    gulp
        .src(['./bootstrapping/templates/defaultModule/**/*'])
        .pipe(modify({
            fileModifier: function(file, contents) {
                return contents.replace(/{{defaultModule}}/g, moduleName);
            }
        }))
        .pipe(gulp.dest(`./src/js/module/${moduleName}/`))
        .on('end', function() {
            gulp.start('change-dest-module-filenames');
        });
});

gulp.task('inject-module', () => {
    gulp
        .src('./src/js/core/dependencies.js')
        .pipe(modify({
            fileModifier: (file, contents) => {
                const dependencyArrayRegEx = /\[([\s\S]*?)\]/g;
                let match = dependencyArrayRegEx.exec(contents)[1];

                match = match.split(',').map(function(dependency) {
                    return dependency.trim();
                });
                match.push(`'${moduleName}'`);

                match = match.join(',\n    ');

                return contents.replace(dependencyArrayRegEx, `[\n    ${match}\n]`);
            }
        }))
        .pipe(gulp.dest('./src/js/core/'));
});

gulp.task('append-import-path', () => {
    gulp.src('./src/js/core/modules.js')
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
            match.push(`import ${moduleName}Module from '../module/${moduleName}/${moduleName}.module';`);
            match = match.join('\n');
            return contents.replace(importPathRegEx, match);
        } else {
            match = `import ${moduleName}Module from '../module/${moduleName}/${moduleName}.module';\n\n${contents}`;
            return match;
        }
    }

    function passDependenciesToBootstrapFunc(contents) {
        const routeArrayRegEx = /bootstrapModules\(([^.][\s\S]*?)\)/;
        let match = routeArrayRegEx.exec(contents)[0];
        let isFirstItem;

        match = match.replace(/[\(/)]/g, '');
        match = match.replace('bootstrapModules', '');
        match = match.split(',').map(function(dependency) {
            return dependency.trim();
        });

        isFirstItem = !_.compact(match).length;

        match.push(`${moduleName}Module`);
        match = match.join(isFirstItem ? '' : ',\n            ');

        return contents.replace(routeArrayRegEx, `bootstrapModules(\n            ${match}\n        )`);
    }
});

gulp.task('add-module-styles', () => {
    gulp
        .src('./src/style/import/_import-modules.scss')
        .pipe(modify({
            fileModifier: (file, contents) => {
                return appendStylesFilePath(contents);
            }
        }))
        .pipe(gulp.dest('./src/style/import/'));

    function appendStylesFilePath(contents) {
        return contents.concat(`\n@import '../../js/module/${moduleName}/style/${moduleName}-module';`);
    }
});

gulp.task('change-dest-module-filenames', () => {
    const sources = `./src/js/module/${moduleName}/**/*.*`;
    const isDefault = /default/i;
    const pathsToBeActioned = glob
        .sync(sources)
        .filter((some) => (isDefault.test(some)))
        .map((file) => (path.resolve(file)));

    pathsToBeActioned.forEach((source) => {
        fs.copySync(source, source.replace('default', moduleName));
        fs.removeSync(source);
    });
});
