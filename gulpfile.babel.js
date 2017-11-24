//gulp imported
let gulp = require('gulp');
let gulpSequence = require('run-sequence'); //Plugin for running gulp tasks in sequence
let deletefile = require('gulp-delete-file'); //Plugin for deleting temporary files
let babel = require('gulp-babel'); //Babel plugin to transpile to EC5

//gulp plugins imported
let concat = require('gulp-concat');
let cssmin = require('gulp-clean-css');
let rename = require("gulp-rename");
let uglify = require('gulp-uglify');

//All js needed for the project
let jsDependencies = [
                        './node_modules/jquery/dist/jquery.min.js',
                        './node_modules/materialize-css/dist/js/materialize.min.js'
                    ];

let devJsGlobs = [
                  './src/js/*.js'
                ];

//All css needed for the project
let cssDependencies = [
                        './node_modules/materialize-css/dist/css/materialize.min.css'
                      ];

let devCssGlobs = [
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
gulp.task('dependeciesScripts', () => { //Take dependencies scripts and put in a temp file
  return gulp.src(jsDependencies)
  .pipe(concat('temp.js'))
  .pipe(gulp.dest(prodJsFolder));
});

gulp.task('dependeciesStyles', () => { //Take dependencies styles and put in a temp file
  return gulp.src(cssDependencies)
  .pipe(concat('temp.css'))
  .pipe(gulp.dest(prodCssFolder));
});

gulp.task('devScripts', () => { //Take scripts, transpile, minify, and put in a temp file
  return gulp.src(devJsGlobs)
    .pipe(babel()) //Transpiles to ES5
    .pipe(concat('temp2.js'))
    .pipe(uglify())
    .pipe(gulp.dest(prodJsFolder));
});

gulp.task('devStyles', () => {
  return gulp.src(devCssGlobs)
    .pipe(concat('temp2.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(prodCssFolder));
});

gulp.task('mergeScripts', () => { //merge dependencies scripts and private scripts
  return gulp.src(['./src/dist/js/temp.js', './src/dist/js/temp2.js'])
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(prodJsFolder));
});

gulp.task('mergeStyles', () => { //merge dependencies styles and private styles
  return gulp.src(['./src/dist/css/temp.css', './src/dist/css/temp2.css'])
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest(prodCssFolder));
});

gulp.task('deleteTemporaries', () => { //delete temporary files (clean build)
    var regexp = /temp[0-9]*/;
    gulp.src(['./src/dist/js/*.js', './src/dist/css/*.css'])
    .pipe(deletefile({
        reg: regexp,
        deleteMatch: true
    }))
});

//Main tasks
//Tasks inside array are made in parallel
gulp.task('default', () => {
  gulpSequence(['dependeciesScripts', 'dependeciesStyles'] , ['devScripts', 'devStyles'], ['mergeScripts', 'mergeStyles'], 'deleteTemporaries');
});

gulp.task('handleScripts', () => {
  gulpSequence('dependeciesScripts' , 'devScripts', 'mergeScripts', 'deleteTemporaries');
});

gulp.task('handleStyles', () => {
  gulpSequence('dependeciesStyles' , 'devStyles', 'mergeStyles', 'deleteTemporaries');
});

//Watch for file change task
gulp.task('watch', () => {
  gulp.watch(devJsGlobs, ['handleScripts']);
  gulp.watch(devCssGlobs, ['handleStyles']);
});