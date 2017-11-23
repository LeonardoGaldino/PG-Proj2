//gulp imported
var gulp = require('gulp');

//gulp plugins imported
var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

//All js needed for the project
var devJsGlobs = [
                  './node_modules/jquery/dist/jquery.min.js',
                  './node_modules/materialize-css/dist/js/materialize.min.js',
                  './src/js/*.js'
                ];

//All css needed for the project
var devCssGlobs = [
                    './node_modules/materialize-css/dist/css/materialize.min.css',
                    './src/css/*.css'
                 ];

//Path for JS folder
var prodJsFolder = './src/dist/js/';

//Path for output JS file
var prodJsPath = (prodJsFolder + 'app.min.js');

//Path for CSS folder
var prodCssFolder = './src/dist/css/';

//Path for output CSS file
var prodCssPath = (prodCssFolder + 'main.min.css');


//Development tasks
gulp.task('devScripts', function() {
  return gulp.src(devJsGlobs)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(prodJsFolder))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(prodJsFolder));
});

gulp.task('devStyles', function() {
  return gulp.src(devCssGlobs)
    .pipe(concat('main.css'))
    .pipe(gulp.dest(prodCssFolder))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(prodCssFolder));
});


//Main tasks
gulp.task('default', ['devScripts', 'devStyles']);

//Watch for file change task
gulp.task('watch', function() {
  gulp.watch(devJsGlobs, ['devScripts']);
  gulp.watch(devCssGlobs, ['devStyles']);
});