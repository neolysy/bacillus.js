module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/*.js',
        dest: 'build/app.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/*.js'],
        tasks: ['jshint', 'uglify'],
        options: {
          spawn: false,
          reload: true
        },
      },
    },
    jshint: {
      all: ['Gruntfile.js', 'src/*.js']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'watch', 'jshint']);

};