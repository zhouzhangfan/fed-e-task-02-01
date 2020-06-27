const sass = require('grunt-sass')
const loadGruntTask = require('load-grunt-tasks')

module.exports = grunt => {
  grunt.initConfig({
    clean: {
      dist: 'dist-grunt/**'
    },
    sass: {
      options: {
        sourceMap: true,
        implementation: sass
      },
      main: {
        files: {
          // 目标文件路径：原文件路径
          'dist-grunt/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          // 目标文件路径：原文件路径
          'dist-grunt/assets/scripts/main.js':'src/assets/scripts/*.js'
        }                
      }
    },
    // watch: {
    //   js: {
    //     files: ['src/assets/scripts/*.js'],
    //     tasks: ['babel'],
    //   },
    //   css: {
    //     files: ['src/scss/*.scss'],
    //     tasks: ['sass'],
    //   }
    // }
  })

  loadGruntTask(grunt)
    
  grunt.registerTask('default', ['clean', 'sass', 'babel' ])
}