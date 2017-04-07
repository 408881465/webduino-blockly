var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var merge = require('merge-stream');
var rename = require("gulp-rename");
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var path = require('path');
var moment = require('moment');
var fileSuffix = moment().format('YYYYMMDDHHmmss');


gulp.task('clean-dist', function () {
  return del(['./dist/*']);
});

gulp.task('copyFiles', ['clean-dist'], function () {
  return gulp.src([
      './**/*', 
      '!dist{,/**}',
      '!node_modules{,/**}',
      '!engine{,*}.html'
    ])
    .pipe(gulp.dest('dist/'));
});

gulp.task('page-index-media', ['copyFiles'], function () {
  return gulp.src(['dist/media/**/*', '!dist/media/svg{,/**}'])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/media/'));
});

gulp.task('page-index-less', ['copyFiles'], function () {
  return gulp.src([
      'dist/css/less/*.less',
    ])
    .pipe(concat('temp.less'))
    .pipe(less())
    .pipe(cleanCSS({
      keepBreaks: true
    }))
    .pipe(rename({
      basename: 'index',
      extname: '.css'
    }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('page-index-css', ['copyFiles', 'page-index-less'], function () {
  return gulp.src([
      'dist/components/bootstrap-select/dist/css/bootstrap-select.min.css',
      'dist/css/index.css'
    ])
    .pipe(concatCss('temp.css'))
    .pipe(cleanCSS({
      keepBreaks: true
    }))
    .pipe(rename({
      basename: 'bundle',
      suffix: '-' + fileSuffix
    }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('page-index-js', ['copyFiles'], function () {
  var jsList = [
    // other
    'dist/components/vue/dist/vue.min.js',
    'dist/components/d3/d3.min.js',
    'dist/components/jquery/dist/jquery.min.js',
    'dist/components/bootstrap/dist/js/bootstrap.min.js',
    'dist/components/bootstrap-select/dist/js/bootstrap-select.min.js',
    'dist/components/Snap.svg/dist/snap.svg-min.js',
    'dist/components/moment/min/moment.min.js',
    'dist/components/i18next/i18next.min.js',
    'dist/components/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js',
    'dist/components/i18next-xhr-backend/i18nextXHRBackend.min.js',
    'dist/components/jquery-i18next/jquery-i18next.min.js',
    'dist/components/defiant/dist/defiant.min.js',

    // Engine
    'dist/components/webduino-js/dist/webduino-base.js',
    'dist/js/engine/core/Board.js',
    'dist/js/engine/transport/MqttTransport.js',
    'dist/components/webduino-js/src/core/WebArduino.js',
    'dist/js/engine/components/Engine.js',
    'dist/js/engine/components/Led.js',
    'dist/js/engine/components/RGBLed.js',
    'dist/js/engine/components/Buzzer.js',
    'dist/js/engine/components/Servo.js',
    'dist/js/engine/components/Matrix.js',
    'dist/js/engine/components/UltraSonic.js',

    // ui
    'dist/js/roundedCorner.js',
    'dist/js/components/arduino-uno.js',
    'dist/js/components/led.js',
    'dist/js/components/servo.js',
    'dist/js/components/matrix.js',
    'dist/js/components/rgbled.js',
    'dist/js/components/button.js',
    'dist/js/components/buzzer.js',
    'dist/js/components/ultrasonic.js',
    'dist/js/components/hand.js',
    'dist/js/history.js',
    'dist/js/utils.js',
    'dist/js/interact.js',
    'dist/js/navbar.js',
    'dist/js/zoom.js',
    'dist/js/drawPath.js',
    'dist/js/editPath.js',
    'dist/js/editPath2.js',
    'dist/js/dndComponent.js',
    'dist/js/focusPoint.js',
    'dist/js/index.js',
    'dist/js/blockly.js'
  ];

  return gulp.src(jsList)
    .pipe(concat('temp.js'))
    .pipe(uglify())
    .pipe(rename({
      basename: 'bundle',
      suffix: '-' + fileSuffix
    }))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('page-index-html', ['copyFiles'], function () {
  return gulp.src('dist/index.html')
    .pipe(htmlreplace({
      'css': 'css/bundle-' + fileSuffix + '.css',
      'js': 'js/bundle-' + fileSuffix + '.js'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-page-index', ['clean-dist', 'copyFiles', 'page-index-media', 'page-index-css', 'page-index-js', 'page-index-html']);

gulp.task('build', ['build-page-index']);

gulp.task('default', ['build']);
