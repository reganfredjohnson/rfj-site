var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	autoprefixer = require('gulp-autoprefixer'),
	postcss = require('gulp-postcss'),
	csswring = require('csswring'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	copy = require('gulp-copy'),
	del = require('del'),
	sequence = require('run-sequence'),
	imagemin = require('gulp-imagemin');


gulp.task('default', function(cb) {
	sequence( 'build', ['watch', 'browsersync'], cb );
});

gulp.task('build', ['clean'], function(cb) {
	sequence( ['styles', 'scripts', 'fonts'], cb );
});

gulp.task('clean', function () {
	return del('public');
});

gulp.task('styles', function() {
	return gulp.src('src/css/app.css')
		.pipe( autoprefixer({ browsers: ['last 2 versions'] }) )
		.pipe( postcss([csswring]) )
		.pipe( rename('app.min.css') )
		.pipe( gulp.dest('public/css/') )
		.pipe( browserSync.stream() );
});

gulp.task('scripts', function() {
	return gulp.src('src/js/app.js')
		.pipe( uglify() )
		.pipe( rename('app.min.js') )
		.pipe( gulp.dest('public/js/') )
		.pipe( browserSync.stream() );
});

gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('public/images'));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts')
    	.pipe( copy('public/fonts') );

});

gulp.task('browsersync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', function() {
	gulp.watch('src/css/app.css', ['styles']);
	gulp.watch('src/js/app.js', ['scripts']);
	gulp.watch('index.html').on('change', browserSync.reload);
});

