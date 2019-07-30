const { src, dest, watch, series, parallel } = require('gulp');

const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');


function jsTask() { 
  return src([
    'assets/js/vendor/*.js', 
    'assets/js/main.js', 
    'assets/js/module*.js'
  ])
    .pipe(concat('bundle.js'))
    .pipe(minify({
        ext:{
          min:'.js'
        },
        noSource: true
    }))
    .pipe(dest('public/build/js'))
};

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
  return src('assets/css/sass/*.scss')
      .pipe(sourcemaps.init()) // initialize sourcemaps first
      .pipe(sass()) // compile SCSS to CSS
      .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
      .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
      .pipe(dest('public/build/css')
    ); // put final CSS in dist folder
}

function watchTask(){
  watch(['assets/js/**/*.js', 'assets/css/sass/*.scss'], 
    parallel(scssTask, jsTask));     
}

exports.default = series(
  parallel(scssTask, jsTask), 
  watchTask
);