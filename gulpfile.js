const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');


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

function compileSass() {
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
    watch('app/index.html', copyIndex());
    watch(paths.htmlSrc, copyHtml);
    watch(paths.scss, compileSass);
    watch(paths.jsSrc, jsMinify);
    watch(paths.imgSrc,jpgCompress);
}

function jsMinify() {
    return src(paths.jsSrc)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(paths.jsDest));
}

async function jpgCompress() {
    const imagemin = (await import('gulp-imagemin')).default;
    const mozjpeg = (await import('imagemin-mozjpeg')).default;
    return src('app/img/**/*.jpg')           // или '*.jpeg' если нужно
        .pipe(imagemin([ mozjpeg({ quality: 75 }) ]))
        .pipe(dest('dist/img'));
}


function copyHtml() {
    return src(paths.htmlSrc)
        .pipe(dest(paths.htmlDest));
}

function copyIndex() {
    return src('app/index.html').pipe(dest('dist'));
}

exports.build = series(parallel(copyHtml, copyIndex, jsMinify, jpgCompress, compileSass));
exports.default = series(parallel(copyHtml, copyIndex, jsMinify, jpgCompress, compileSass), serve);
