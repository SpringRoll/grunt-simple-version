/*
 * grunt-simple-version
 *
 * Copyright (c) 2014 CloudKid
 * Licensed under the MIT license.
 */
module.exports = function(grunt)
{
	'use strict';

	// Load the grunt task
	require('./tasks/version.js')(grunt);

	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'libs/*.js'
			]
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('test', ['jshint']);
};