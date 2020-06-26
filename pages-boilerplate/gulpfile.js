// 实现这个项目的构建任务

const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()
const bs = browserSync.create()

// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')

const clean = () => {
  return del(['dist', 'temp'])
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src'})
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
} 

const script = () => {
  return src('src/assets/scripts/*.js')
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig())
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
      // 去掉多余空格字符
      collapseWhitespace: true,
      // 压缩html文件中的css
      minifyCSS: true,
      // 压缩html文件中的js
      minifyJS: true
    })))
    .pipe(dest('dist'))
}

const compile = parallel(style, script, page)

const build = series(clean, parallel(series(compile, useref), image, font, extra))

const develop = series(compile, serve)

module.exports = { 
  clean,
  build,
  develop
}