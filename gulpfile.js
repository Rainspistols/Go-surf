const { series, src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
// const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');

function clean() {
  return del('docs');
}

function scss(done) {
  return src('app/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 8 versions']
      })
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('app/css'));
  done();
}

function css(done) {
  return src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/animate.css/animate.css'
  ])
    .pipe(concat('_libs.scss'))
    .pipe(dest('app/scss'));
  done();
}

function htmlUpdate(done) {
  return src('app/*.html');
  done();
}

function jsUpdate(done) {
  return src('app/js/*.js');
  done();
}

function jsMinify(done) {
  return src([
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/wow.js/dist/wow.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'));
  done();
}

// exports.watch = parallel(css, scss, jsUpdate, browser - sync, 'watch');

// gulp.task('watch', function() {
//   gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
//   gulp.watch('app/*.html', gulp.parallel('html'));
//   gulp.watch('app/js/*.js', gulp.parallel('script'));
// });

// gulp.task('build', gulp.series('clean', 'export'));

// gulp.task(
//   'default',
//   gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch')
// );

function buildHtml() {
  return src('app/**/*.html').pipe(dest('docs'));
}

function buildCss() {
  return src('app/css/*.css').pipe(dest('docs/css'));
}

function buildJs() {
  return src('app/js/*.js').pipe(dest('docs/js'));
}

function buildFonts() {
  return src('app/fonts/**/*.*').pipe(dest('docs/font'));
}
function buildImg() {
  return src('app/img/**/*.*').pipe(dest('docs/img'));
}

function watchFiles() {
  watch('app/scss/**/*.scss', scss);
  watch('app/*.html', htmlUpdate);
  watch('app/js/*.js', jsUpdate);
}

exports.watch = watchFiles;
exports.default = series(css, scss, jsMinify, watchFiles);
exports.build = series(
  clean,
  buildHtml,
  buildCss,
  buildJs,
  buildFonts,
  buildImg
);
