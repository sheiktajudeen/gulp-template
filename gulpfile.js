var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');
var zip = require('gulp-zip');

//less plugins
var less = require('gulp-less');
var LessAutoPrefix = require('less-plugin-autoprefix');

var lessautoprefix = new LessAutoPrefix({
    browsers:['last 2 versions']
});

//Handlebars plugins
var handlebars = require('gulp-handlebars');
var handlebarslib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

//image compression
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegrecompress = require('imagemin-jpeg-recompress');

//file-path
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = './public/css/**/*.css';
var SCSS_PATH = 'public/scss/**/*.scss';
var DIST_PATH = 'public/dist';
var TEMPLATES_PATH = 'templates/**/*.hbs';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

//Styles
// gulp.task('styles',  () => {
//     console.log('starting gulp style task');
//
//     return gulp.src(['public/css/reset.css', CSS_PATH])
//         .pipe(plumber(function(err){
//             console.log('Styles task err');
//             console.log(err);
//             this.emit('end');
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(autoprefixer({
//             browsers:['last 2 versions','ie 8']
//         }))
//         .pipe(concat('styles.css'))
//         .pipe(minifyCss())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(DIST_PATH))
//         .pipe(livereload());
// });

//Styles for scss
// gulp.task('styles',  () => {
//     console.log('starting gulp style task');
//
//     return gulp.src('public/scss/styles.scss')
//         .pipe(plumber(function(err){
//             console.log('Styles task err');
//             console.log(err);
//             this.emit('end');
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(autoprefixer())
//         .pipe(sass({
//             outputStyle: 'compressed'
//         }))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(DIST_PATH))
//         .pipe(livereload());
// });
//
// //Scripts
// gulp.task('scripts', () => {
//    console.log('Starting scripts task');
//
//    return gulp.src(SCRIPTS_PATH)
//        .pipe(uglify())
//        .pipe(gulp.dest(DIST_PATH))
//        .pipe(livereload());
// });

//styles for less
gulp.task('styles',  () => {
    console.log('starting gulp style task');

    return gulp.src('public/less/styles.less')
        .pipe(plumber(function(err){
            console.log('Styles task err');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [lessautoprefix]
        }))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

//Scripts
gulp.task('scripts', () => {
    console.log('Starting scripts task');

    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function(err){
            console.log('Scripts task error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

//Images
gulp.task('images', () => {
   return gulp.src(IMAGES_PATH)
       .pipe(imagemin(
           [
              imagemin.gifsicle(),
              imagemin.jpegtran(),
              imagemin.optipng(),
              imagemin.svgo(),
              pngquant(),
              jpegrecompress()
           ]
       ))
       .pipe(gulp.dest(DIST_PATH + '/images'));
});

//hbs
gulp.task('templates', () => {
    return gulp.src(TEMPLATES_PATH)
        .pipe(handlebars({
            handlebars: handlebarslib
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'templates',
            noRedeclare: true
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

gulp.task('clean', () => {
   return del.sync([
     DIST_PATH
   ]);
});

gulp.task('export', () => {
   return gulp.src('public/**/*')
       .pipe(zip('website.zip'))
       .pipe(gulp.dest('./'));
});

gulp.task('default',['clean','images', 'templates','styles','scripts'], () => {
    console.log('Starting default task');
});

gulp.task('watch',['default'], () => {
   console.log('Starting watch task');
   require('./server');
   livereload.listen();
   gulp.watch(SCRIPTS_PATH,['scripts']);
   // gulp.watch(CSS_PATH,['styles']);
   // gulp.watch(SCSS_PATH,['styles']);
   gulp.watch('public/less/**/*.less',['styles']);
   gulp.watch(TEMPLATES_PATH,['templates']);
});