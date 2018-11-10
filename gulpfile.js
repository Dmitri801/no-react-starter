const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
// Compile SCSS to CSS
gulp.task("styles", () => {
  return gulp
    .src("src/sass/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Copy into the dist folder

gulp.task("copy-html", () => {
  return gulp.src("src/*.html").pipe(gulp.dest("./dist"));
});

gulp.task("copy-images", () => {
  return gulp
    .src("src/img/*")
    .pipe(
      imagemin({
        progressive: true,
        use: [pngquant()]
      })
    )
    .pipe(gulp.dest("./dist/img"));
});

// JS Concatenation
gulp.task("scripts", () => {
  gulp
    .src("src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/js"));
});

gulp.task("scripts-dist", () => {
  gulp
    .src("src/js/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

// Watch And Serve
gulp.task("serve", ["styles", "copy-html", "copy-images", "scripts"], () => {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(["src/sass/*.scss"], ["styles"]);
  gulp.watch(["src/*.html"]).on("change", browserSync.reload);
  gulp.watch(["src/js/*.js"], ["scripts"]).on("change", browserSync.reload);
  gulp.watch("src/*.html", ["copy-html"]);
});

// Set Up Production Build
gulp.task("build", ["copy-html", "copy-images", "styles", "scripts-dist"]);

// Default Task
gulp.task("default", ["serve"]);
