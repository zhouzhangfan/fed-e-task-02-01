const sass = require('node-sass')
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
    htmlmin: {
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: true
      },
      main: {
        files: {                                   // Dictionary of files
          'dist-grunt/index.html': 'src/index.html',     // 'destination': 'source'
          'dist-grunt/about.html': 'src/about.html'
        }
      }
    }
  })

  loadGruntTask(grunt)
    
  grunt.registerTask('default', ['clean', 'sass', 'babel', 'htmlmin' ])
}