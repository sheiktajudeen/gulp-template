var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

//file-path
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = './public/css/**/*.css';
var DIST_PATH = 'public/dist';

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
gulp.task('styles',  () => {
    console.log('starting gulp style task');

    return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function(err){
            console.log('Styles task err');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

//Scripts
gulp.task('scripts', () => {
   console.log('Starting scripts task');

   return gulp.src(SCRIPTS_PATH)
       .pipe(uglify())
       .pipe(gulp.dest(DIST_PATH))
       .pipe(livereload());
});

//Images
gulp.task('images', () => {
   console.log('Starting images task');
});

gulp.task('default', () => {
    console.log('Starting default task');
});

gulp.task('watch', () => {
   console.log('Starting watch task');
   require('./server');
   livereload.listen();
   gulp.watch(SCRIPTS_PATH,['scripts']);
   // gulp.watch(CSS_PATH,['styles']);
   gulp.watch('public/scss/**/*.scss',['styles']);
});