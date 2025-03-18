// gulp
const { watch, series, src, dest, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
// server
const browserSync = require("browser-sync");
// utility
const glob = require("glob");
const ttfToWoff = require("gulp-ttf2woff");
//filepaths
const templateFilepaths = "./src/pages/*.hbs";
const distFolderPath = "./dist/pages";

function compilateHbs(cb) {
  function getData(hbsDataFilePath) {
    try {
      return require(hbsDataFilePath);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  glob(templateFilepaths, (err, hbsFilePaths) => {
    if (err) {
      console.log("Error in fetching templates.");
    } else {
      hbsFilePaths.forEach((filepath) => {
        const hbsDataFilePath = filepath.replace(".hbs", "");
        const hbsData = getData(hbsDataFilePath);
        const filename = filepath.split("/")[3].replace(".hbs", "");

        return src(filepath)
          .pipe(
            handlebars(hbsData, {
              batch: ["./src/partials", "./src/partials/shared"],
            })
          )
          .pipe(rename(filename + ".html"))
          .pipe(dest(distFolderPath));
      });
    }
  });
  // Just for avoiding error
  cb();
}

function css() {
  return src("./src/client/styles/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("./dist/client/styles"));
}

function js() {
  return src("./src/client/scripts/**/*.js").pipe(
    dest("./dist/client/scripts")
  );
}

function assets() {
  return src("./src/client/assets/**/*").pipe(dest("./dist/client/assets"));
}

function browserInit() {
  browserSync.init({
    server: {
      baseDir: "./",
      browser: ["google chrome", "firefox", "iexplore"],
    },
  });
}

function watchFor() {
  watch(["./src/client/styles/**/*.scss"], css);
  watch(["./src/client/scripts/**/*.js"], js);
  watch(["./src/client/assets/**/*"], assets);
  watch("./src/**/*.hbs", compilateHbs);
  watch(["./src/**/*", "./index.html"]).on("change", browserSync.reload);
}

exports.default = series(
  [compilateHbs, css, js, assets],
  parallel(browserInit, watchFor)
);

exports.fonts = function () {
  return src("./src/client/assets/fonts/*.ttf")
    .pipe(ttfToWoff())
    .pipe(dest("./src/client/assets/fonts"));
};
