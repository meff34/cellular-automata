'use strict';

const gulp = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-sass')

gulp.task('default', ['babel', 'sass'])

gulp.task('watch', () => {
  gulp.watch('./src/*.sass', ['sass']);
  gulp.watch('./src/*.js', ['babel']);
})

gulp.task('babel', () => {
  return gulp.src('src/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('./dst'))
})

gulp.task('sass', function () {
  return gulp.src('./src/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dst'))
})