//gulp imported
let gulp = require('gulp');
let babel = require('gulp-babel'); //Babel plugin to transpile to EC5

//gulp plugins imported
let concat = require('gulp-concat');
let cssmin = require('gulp-clean-css');
let rename = require("gulp-rename");
let uglify = require('gulp-uglify');

//All js needed for the project
let devJsGlobs = [
                  './node_modules/jquery/dist/jquery.min.js',
                  './node_modules/materialize-css/dist/js/materialize.min.js',
                  './src/js/*.js'
                ];

//All css needed for the project
let devCssGlobs = [
                    './node_modules/materialize-css/dist/css/materialize.min.css',
                    './src/css/*.css'
                 ];

//Path for JS folder
let prodJsFolder = './src/dist/js/';

//Path for output JS file
let prodJsPath = (prodJsFolder + 'app.min.js');

//Path for CSS folder
let prodCssFolder = './src/dist/css/';

//Path for output CSS file
let prodCssPath = (prodCssFolder + 'main.min.css');


//Development tasks
gulp.task('devScripts', () => {
  return gulp.src(devJsGlobs)
    .pipe(babel()) //Transpiles to ES5
    .pipe(concat('app.js'))
    .pipe(gulp.dest(prodJsFolder))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(prodJsFolder));
});

gulp.task('devStyles', () => {
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
gulp.task('watch', () => {
  gulp.watch(devJsGlobs, ['devScripts']);
  gulp.watch(devCssGlobs, ['devStyles']);
});