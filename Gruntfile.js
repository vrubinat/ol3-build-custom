

function getFiles(dir,files_){
	var fs = require('fs');
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_=[];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name,files_);
        } else {
        	if (/.js$/.test(files[i])){
        		var d = (dir + "/" + files[i].slice(0,-3)).replace('maps/','');
        	 	files_.push([files[i].slice(0,-3),d]);	
        	}
           
        }
    }
    return files_;
}


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
	
	
	var conf=grunt.config.get('pkg').build;

	
	grunt.registerTask('build', "build ol3 for maps param : file name: ",function(file){
			require('./tasks/updateLibs')(grunt,conf.update);
			require('./tasks/compileOl3')(grunt,conf,file);
			require('./tasks/ol3-exports')(grunt,conf);
			var f = require('./tasks/generate')(grunt,conf,file);
			grunt.task.run(['updateLibs','exports',f,'compileOl3']);
	});

	var files = getFiles('maps')
	

	for (var i=0,len=files.length;i<len;i++){
		grunt.registerTask(files[i][0], ['build:'+files[i][1]]);
	}
	
};