const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const help = require('gulp-task-listing')

gulp.task('help', help)

gulp.task('compile', [
  'compile-lib'
])

gulp.task('compile-lib', () => {
  return gulp.src('lib/**/*.js')
  .pipe(babel({
    presets: ['es2015'],
    plugins: [
      'syntax-async-functions',
      'transform-async-to-generator',
      'transform-runtime'
    ]
  }))
  .pipe(gulp.dest('build/lib'))
})

gulp.task('clean', () => {
  return del(['build'])
})

gulp.task('default', ['compile'])
