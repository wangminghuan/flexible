var gulp=require('gulp'),
   uglify = require('gulp-uglify'),
   browserSync= require('browser-sync');

gulp.task('scripts', function() {
  return gulp.src(["js/*.js"])
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: ''
    },
  })
});

gulp.task('watch', ['browserSync'], function (){
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/*.js', browserSync.reload);
});