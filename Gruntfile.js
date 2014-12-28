module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		web_server: {
		   options: {
			cors: true,
			port: 8084,
			nevercache: true,		
		  },
		  foo: 'bar'
		}
	});
	grunt.loadNpmTasks('grunt-web-server');

	require('./tasks/updateLibs')(grunt);
	require('./tasks/compileOl3')(grunt);
	require('./tasks/generate')(grunt);
	
	//grunt.registerTask('compileOl3','compile ol3',function(){});
	// Default task(s).
  	grunt.registerTask('default', ['generate','updateLibs','compileOl3']);

};