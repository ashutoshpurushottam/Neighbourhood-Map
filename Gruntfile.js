module.exports = function(grunt) {

  // grunt tasks
  require('load-grunt-tasks')(grunt);

  // configuration 
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Minify JS files
    uglify: {
      build: {
        files: {
          'dist/js/app.min.js': 'src/js/app.js',
          'dist/js/model.min.js': 'src/js/model.js',
          'dist/js/smallscreen.min.js': 'src/js/smallscreen.js',
          'dist/js/restaurants.min.js': 'src/js/restaurants.js'
        }
      }
    },

    // Minify CSS files
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css/',
          ext: '.min.css'
        }]
      }
    }
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // use 'grunt' command (tasks)
  grunt.registerTask('default', ['uglify', 'cssmin']);

};