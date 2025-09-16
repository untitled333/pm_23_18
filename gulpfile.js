const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const paths = {
    scss: 'app/scss/**/*.scss',
    cssDest: 'dist/scss',
    htmlSrc: 'app/html/**/*.html',
    htmlDest: 'dist/html',
    jsSrc: 'app/js/**/*.js',
    jsDest: 'dist/js',
    imgSrc: 'app/img/**/*',
    imgDest: 'dist/img'
};

function scss_task() {
    return src(paths.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.cssDest))
        .pipe(browserSync.stream({ match: '**/*.css' }));
}

function serve() {
    browserSync.init({
        server: { baseDir: 'dist' },
        open: false
    });
    watch(paths.htmlSrc, copyHtml);
    watch(paths.scss, scss_task);
    watch(paths.jsSrc, copyJs);
    watch(paths.imgSrc, copyImg);
}

function copyHtml() {
    return src(paths.htmlSrc)
        .pipe(dest(paths.htmlDest));
}
function copyIndex() {
    return src('app/index.html').pipe(dest('dist'));
}
function copyJs() {
    return src(paths.jsSrc).pipe(dest(paths.jsDest));
}
function copyImg() {
    return src(paths.imgSrc).pipe(dest(paths.imgDest));
}
exports.build = series(parallel(copyHtml, copyIndex, copyJs, copyImg, scss_task));
exports.default = series(parallel(copyHtml, copyIndex, copyJs, copyImg, scss_task), serve);