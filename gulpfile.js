var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	html2jade = require('gulp-html2jade'),
	webserver = require('gulp-webserver'),
	ghPages = require("gulp-gh-pages"),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	notify = require('gulp-notify');


gulp.task('webserver', function(){
	gulp.src('dist')
		.pipe(webserver({
			port: 8080,
			livereload: true,
      		open: true
		})
	);
});


gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('template', function(){
	gulp.src('app/templates/pages/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('dist'))
});

gulp.task('scss',  function() {
    gulp.src(['app/css/main.scss'])
		.pipe(sass())
		.pipe(notify('CSS-файлы успешно обновлены!'))
		.pipe(gulp.dest('dist/css/'));
});

 gulp.task('image', function() {
     gulp.src('dist/img/*')
       .pipe(gulp.dest('raw/images'))
       .pipe(imagemin({
       		progressive: true,
       		use: [pngquant()]
       }))
       .pipe(gulp.dest('dist/img'));
 });


 gulp.task('convert', function(){
 	gulp.src('raw/builder/html/*.html')
 		.pipe(html2jade())
		.pipe(notify('Шаблоны .jade обновлены'))
 		.pipe(gulp.dest('raw/builder/jade'));
 });


gulp.task('watch', function() {
   gulp.watch(['app/css/*.scss', 'app/css/**/*.scss', 'app/templates/*.jade', 'app/templates/*/*.jade'], ['scss', 'template']);
});

// include fonts
gulp.task('tofonts1', function(){
 	gulp.src("bower_components/fontawesome/fonts/*")
 	.pipe(gulp.dest("dist/fonts/fontawesome"))
 });
gulp.task('tofonts2', function(){
 	gulp.src("bower_components/open-sans-fontface/fonts/**")
 	.pipe(gulp.dest("dist/css/fonts/"))
 });

// default task
gulp.task('default', ['webserver', 'scss', 'template', 'watch']);

// other tasks
gulp.task('update', ['scss', 'template', 'image', 'fonts']);
