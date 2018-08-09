const gulp = require('gulp'),
	  watch = require('gulp-watch'),
	  sass = require('gulp-sass'),
	  rename = require('gulp-rename'),
	  autoprefixer = require('gulp-autoprefixer'),
	  sourcemaps = require('gulp-sourcemaps'),
	  connect = require('gulp-connect');

const metalsmith = require('./metalsmith.js')

gulp.task('metalsmith', function() {
	metalsmith.build(err => {
		if (err) throw err;
	});
});

gulp.task('sass', function() {
	return gulp.src('./scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(autoprefixer(['last 2 versions', '> 5%', 'Firefox ESR']))
		.pipe(gulp.dest('./assets/css'))
		.pipe(connect.reload());
});

gulp.task('connect', function() {
	connect.server({
		root: 'build',
		livereload: true
	});
});

gulp.task('watch', function() {
	gulp.watch(['contents/**/*', 'layouts/**/*'], ['metalsmith']);
	gulp.watch(['scss/**/*.scss'], ['sass', 'metalsmith']);
});

gulp.task('build', ['sass', 'metalsmith']);

gulp.task('default', ['connect', 'watch']);
