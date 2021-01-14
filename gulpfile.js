const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const jsmin = require('gulp-jsmin');

/* Browser sync packages */
const { init , stream, reload } = require('browser-sync');

gulp.task('jsmin', () => {
    return gulp.src('./app/js/**/*.js')
        .pipe(jsmin())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', () => {
    return gulp.src('./app/scss/style.scss')
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(stream())
});

gulp.task('htmlmin', () => {
    return gulp.src('./app/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe( gulp.dest('./dist') )
});

gulp.task('default', () => {

    init({
        server:'./dist'
    });

    gulp.watch('./app/scss/**/*.scss', gulp.series('sass')).on('change', reload)
    gulp.watch('./app/js/**/*.js', gulp.series('jsmin')).on('change', reload) 
    gulp.watch('./app/*.html', gulp.series('htmlmin')).on('change', reload)
});