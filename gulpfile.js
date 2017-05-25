var gulp = require('gulp'),
sass = require('gulp-sass'),
bulkSass = require('gulp-sass-bulk-import'),
sourcemaps = require('gulp-sourcemaps'),
autoprefixer = require('gulp-autoprefixer'),
minify = require('gulp-minify-css'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
liquid = require("gulp-liquid");

var scssSource = 'src/scss/';
var cssDest = 'assets/';
var jsSource = 'src/js/';
var jsDest = 'assets/';

gulp.task('build-css', function() {
  console.log('buidling css..')
  gulp.src(scssSource + 'manifest.scss')
  .pipe(bulkSass())
  .pipe(liquid({
        locals: {}
    }))
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 25 versions']
  }))
  .pipe(rename({ basename: 'site', extname: ".css.liquid"}))
  .pipe(gulp.dest(cssDest))
});

gulp.task('build-js', function() {
gulp.src([jsSource+'plugins/**/*',jsSource+'/*'])
.pipe(concat('site.js'))
.pipe(gulp.dest(jsDest));
});

gulp.task('watch', function(){
  gulp.watch(scssSource+ '**/*.scss', ['build-css']);
  gulp.watch(jsSource +'**/*',['build-js']);
});

gulp.task('default', ['build-css', 'build-js', 'watch']);
