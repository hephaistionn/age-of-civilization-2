const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');
const watchify = require('watchify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const babel  = require('gulp-babel');
const concat = require("gulp-concat");
const fs = require("fs");
require("./gulpAssets")(gulp);

const config = {
  output: './build',
  input: './client',
  inputSass: './client/app.scss',
  browserifyOptions: {
    entries: ['./client/app.js'],
    debug: false,
    insertGlobals : true
  },
  babelifyOptions: {
    presets: ['es2015'],
    compact: false,
    global: true
  }
};

var b = watchify(browserify(config.browserifyOptions));

function bundle() {
  return b.bundle()
      .on('error', gutil.log)
      .pipe(source('app.js'))
      .pipe(buffer())
      //.pipe(uglify().on('error', gutil.log))
      .pipe(gulp.dest(config.output))
      .on('end', function() {
        gulp.src(config.input + '/index.html')
            .pipe(gulp.dest(config.output));
      });
}

gulp.task('watch-js',bundle);
b.on('update', bundle);
b.on('log', gutil.log);

gulp.task('build-js', () => {
  return browserify(config.browserifyOptions)
  .transform('babelify',config.babelifyOptions)
  .bundle()
  .pipe(fs.createWriteStream("build/app.js"))
});

gulp.task('build-css', function() {
  return gulp.src(config.inputSass)
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.output));
});

gulp.task('watch-css', function() {
  gulp.watch(config.input + '/**/*.scss', ['build-css']);
});

/**
 * build
 */
gulp.task('build',['build-js', 'build-css']);

/**
 * watch updates
 */
gulp.task('watch', ['watch-js', 'watch-css']);
