// 实现这个项目的构建任务

const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')

// 使用loadPlugins的方式引入gulp插件
const plugins = loadPlugins()
// 创建开发服务器对象
const bs = browserSync.create()

// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')

// 清除构建产物任务
const clean = () => {
  return del(['dist', 'temp'])
}

// 样式构建
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src'})
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
    // 以stream的方式触发开发服务器的重载
    .pipe(bs.reload({ stream: true }))
} 

// js构建
const script = () => {
  return src('src/assets/scripts/*.js')
    // 采用babel编译，@babel/preset-env包中包含了最新的ES语法
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

// html构建，采用swig模板
const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig())
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

// 图片构建，仅压缩
const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

// 字体构建，仅压缩
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

// 额外的文件转存
const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

// 开发服务器
const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  // 监控图片、字体及额外的文件，当这些文件变化时，直接reload开发服务器，对变化进行预览
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    // 自动启动浏览器
    // open: false,
    // 监控文件变化
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

// 引用依赖，将中间产物文件中的依赖进行引入
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

// 编译任务
const compile = parallel(style, script, page)

// 构建任务
const build = series(clean, parallel(series(compile, useref), image, font, extra))

// 开发模式，
const develop = series(compile, serve)

module.exports = { 
  clean,
  build,
  develop
}