var gulp = require('gulp'),
    gutil = require('gulp-util');

require('gulp-grunt')(gulp);

var pkg = require('./package.json'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    jasmine = require('gulp-jasmine'),
    rename = require('gulp-rename');

var banner = ['/*!',
    ' *<%= pkg.name %> - <%= pkg.description %>',
    ' *Copyright (C) <2014>  <<%= pkg.author %>>',
    ' *',
    ' *This program is free software: you can redistribute it and/or modify',
    ' *it under the terms of the GNU General Public License as published by',
    ' *the Free Software Foundation, either version 3 of the License, or',
    ' *(at your option) any later version.',
    ' *',
    ' *This program is distributed in the hope that it will be useful,',
    ' *but WITHOUT ANY WARRANTY; without even the implied warranty of',
    ' *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the',
    ' *GNU General Public License for more details.',
    ' *',
    ' *You should have received a copy of the GNU General Public License',
    ' *along with this program.  If not, see <http://www.gnu.org/licenses/>.',
    ' */',
  ''].join('\n');
  
gulp.task('concat-specs', function () {
    return gulp.src('./source/test/specs/*.js')
        .pipe(concat('main.spec.js'))
        .pipe(gulp.dest('./source/test/'));
});

gulp.task('concat-lib-and-test', function () {
    return gulp.src(['./' + pkg.name + '.js', './source/test/main.spec.js'])
        .pipe(concat('test.js'))
        .pipe(gulp.dest('./source/test/'))
});

gulp.task('test', function () {
    return gulp.src('./source/test/test.js')
        .pipe(jasmine());
});

// Add banner to pkg.name.js and minify(pkg.name.min.js)
gulp.task('production', ['grunt-smash'], function () {
    return gulp.src('./' + pkg.name + '.js')
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('.'))
        .pipe(uglify({ outSourceMap: false, preserveComments: 'some'}))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function () {
    var watcher1 = gulp.watch('./source/js/**/*.js', ['production']),
        watcher2 = gulp.watch('./source/test/specs/*.js', ['concat-specs']),
        watcher3 = gulp.watch(['./'+ pkg.name + '.js', './source/test/main.spec.js'], ['concat-lib-and-test']),
        watcher4 = gulp.watch('./source/test/test.js', ['test']),
        watcher5 = gulp.watch(['./'+ pkg.name + '.js'], ['grunt-jsdoc']);

        watcher1.on('change', function(event) {
            console.log('WATCHER 1 - File '+event.path+' was '+event.type+', running tasks...');
        });
        
        watcher2.on('change', function(event) {
            console.log('WATCHER 2 - File '+event.path+' was '+event.type+', running tasks...');
        });
        
        watcher3.on('change', function(event) {
            console.log('WATCHER 3 - File '+event.path+' was '+event.type+', running tasks...');
        });
        
        watcher4.on('change', function(event) {
            console.log('WATCHER 4 - File '+event.path+' was '+event.type+', running tasks...');
        });
        
        watcher5.on('change', function(event) {
            console.log('WATCHER 5 - File '+event.path+' was '+event.type+', running tasks...');
        });
});

// There is another task grunt-smash, can see in Gruntfile
gulp.task('default', ['production', 'test', 'watch']);
