//gulp imported
var gulp = require('gulp');

//gulp plugins imported
var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

//All js needed for the project
var dev_js_globs = [
                './src/js/*.js'
                ];

//All css needed for the project
var dev_css_globs = [
                    './src/css/*.css'
                 ];

//Path for JS folder
var prod_js_folder = './src/dist/js/';

//Path for output JS file
var prod_js_path = (prod_js_folder + 'app.min.js');

//Path for CSS folder
var prod_css_folder = './src/dist/css/';

//Path for output CSS file
var prod_css_path = (prod_css_folder + 'main.min.css');


//Development tasks
gulp.task('dev_scripts', function() {
  return gulp.src(dev_js_globs)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(prod_js_folder))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(prod_js_folder));
});

gulp.task('dev_styles', function() {
  return gulp.src(dev_css_globs)
    .pipe(concat('main.css'))
    .pipe(gulp.dest(prod_css_folder))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(prod_css_folder));
});


//Main tasks
gulp.task('default', ['dev_scripts', 'dev_styles']);

//Watch for file change task
gulp.task('watch', function() {
  gulp.watch(dev_js_globs, ['dev_scripts']);
  gulp.watch(dev_css_globs, ['dev_styles']);
});