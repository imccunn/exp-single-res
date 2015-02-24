'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dev: {
          src: ['server.js', 'Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'models/**/*.js', 'routes/**/*.js']
      }
    },
    jscs: {
      src: ['server.js', 'Gruntfile.js', 'lib/**/*.js', 'test/*.js', 'models/**/*.js', 'routes/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    simplemocha: {
      all: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      scripts: {
        files: ['routes/**/*.js', 'models/**/*.js', 'lib/**/*.js', 'test/*.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
  grunt.registerTask('default', ['test']);
};
