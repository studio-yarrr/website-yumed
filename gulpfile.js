"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync").create();
const babel = require('gulp-babel');

/* Paths */
const srcPath = "src/";
const distPath = "dist/";
const path = {
  build: {
    html: distPath,
    js: distPath + "assets/js/",
    css: distPath + "assets/css/",
    images: distPath + "assets/images/",
    fonts: distPath + "assets/fonts/",
    video: distPath + "assets/video/",
    models: distPath + "assets/models/",
  },
  src: {
    html: srcPath + "*.html",
    js: srcPath + "assets/js/*.{js,map}",
    css: srcPath + "assets/scss/*.scss",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg,json}",
    video: srcPath + "assets/video/**/*.*",
    models: srcPath + "assets/models/**/*.*",
  },
  watch: {
    html: srcPath + "**/*.html",
    js: srcPath + "assets/js/**/*.{js,map}",
    css: srcPath + "assets/scss/**/*.scss",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    video: srcPath + "assets/video/**/*.*",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg,json}",
    models: srcPath + "assets/models/**/*.*",
  },
  clean: "./" + distPath,
};

/* Tasks */

function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
  });
}

function html() {
  panini.refresh();
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(
      panini({
        root: srcPath,
        layouts: srcPath + "layouts/",
        partials: srcPath + "partials/",
        helpers: srcPath + "helpers/",
        data: srcPath + "data/",
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      sass({
        includePaths: "./node_modules/",
      })
    )
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function cssWatch() {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      sass({
        includePaths: "./node_modules/",
      })
    )
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(rigger())
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return src(path.src.images)
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function imagesWithoutMin() {
  return src(path.src.images)
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function video() {
  return src(path.src.video)
    .pipe(dest(path.build.video))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.reload({ stream: true }));
}

function models() {
  return src(path.src.models)
    .pipe(dest(path.build.models))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del(path.clean);
}

function cleanWithoutImg() {
  return del([`!dist/**/images/**`, 'dist/**/fonts/**', 'dist/**/css/**', 'dist/**/js/**', 'dist/index.html'])
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.video], video);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.models], models);
}

function watchFilesDev() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], imagesWithoutMin);
  gulp.watch([path.watch.video], video);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.models], models);
}

const start = gulp.series(cleanWithoutImg, gulp.parallel(html, css, js, fonts));
const watch = gulp.parallel(start, watchFiles, serve);
const build = gulp.series(clean, html, css, js, images, video, fonts);
const serverStart = gulp.series(clean, html, css, js, images, video, fonts, models, gulp.parallel(watchFiles, serve));
const dev = gulp.series(clean, html, css, js, imagesWithoutMin, video, fonts, models, gulp.parallel(watchFilesDev, serve));

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.video = video;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = serverStart;
exports.dev = dev;
exports.cleanWithoutImg = cleanWithoutImg
exports.start = start
