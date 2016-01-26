var gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		htmlmin = require('gulp-htmlmin'),
		uglify = require('gulp-uglify'),
		cssnano = require('gulp-cssnano');

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: "app"
		}
	});
	gulp.watch("app/**/*.*").on('change', browserSync.reload);
});