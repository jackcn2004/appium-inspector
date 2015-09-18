var gulp = require('gulp'),
    run = require('gulp-run'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload');

gulp.task('default', ['watch', 'run'], function() {
    return gulp.src('main.js')
        .pipe(rename('index.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('copy-html', function() {
    gulp.src('browser/**/*.*')
        // Perform minification tasks, etc here
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('browser/**/*.*',['copy-html']);
});

gulp.task('run', [], function() {
    return run('electron .').exec().pipe(gulp.dest('output'));
});