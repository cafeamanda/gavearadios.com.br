'use strict';

require('es6-promise').polyfill();

var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    del = require('del');


gulp.task('usemin', function() {
  return gulp.src('./app/**/*.html')
  .pipe(usemin({
    css:[minifycss(),rev()],
    js:[ngannotate(),uglify(),rev()]
  }))
  .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function() {
  return del(['dist/images']), gulp.src('app/images/**/*')
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive:true, interlaced: true})))
  .pipe(gulp.dest('dist/images'))
  .pipe(notify({ message: 'Images task complete'}));
});

// Clean
gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('copyfonts', ['clean'], function() {
  gulp.src('./app/font-awesome/fonts/**/*.{ttf,woff,wof,svg}*')
  .pipe(gulp.dest('./dist/fonts'));
});

// Watch
gulp.task('watch', ['browser-sync'], function() {

  // Watch .js files
  gulp.watch('{app/**/*.js,app/**/*.css,app/**/*.html}',['usemin']);

  // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function() {
  var files = [
    'app/**/*.html',
    'app/**/*.css',
    'app/images/**/*.png',
    'app/**/*.js',
    'dist/**/*'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "dist",
      index: "app/index.html"
    }
  });

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);

});


// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('usemin','imagemin','copyfonts');
});
