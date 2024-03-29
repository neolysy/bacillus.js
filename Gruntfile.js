module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: ['src/*/*.js', 'src/*.js'],
				dest: 'build/app.min.js'
			}
		},
		watch: {
			scripts: {
				files: ['Gruntfile.js', 'src/*.js', 'test/*.js'],
				tasks: ['jshint', 'uglify', 'jasmine', 'jsdoc'],
				options: {
					spawn: false,
					reload: true
				},
			},
		},
		jshint: {
			all: ['Gruntfile.js', 'src/*.js']
		},
		jasmine: {
			test: {
				src: ['src/*/*.js', 'src/*.js'],
				options: {
					specs: 'test/*.spec.js'
				}
			}
		},
		jsdoc : {
			dist : {
				src: ['src/*.js', 'test/*.js'], 
				options: {
					destination: 'doc'
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-jsdoc');

	// Default task(s).
	grunt.registerTask('default', ['uglify', 'watch', 'jshint', 'jasmine', 'jsdoc']);

};