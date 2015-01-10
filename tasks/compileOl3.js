
module.exports = function(grunt,conf,file){
	grunt.registerTask('compileOl3','compile ol3',function(){

		//Build external ol3 deps
		require('../lib/ol3/tasks/build-ext')();
		require('../lib/ol3/tasks/generate-info')();		
	    //require('../lib/ol3/tasks/generate-exports')({"exports": ["*"]});		
		grunt.loadNpmTasks('grunt-closure-tools');
		grunt.loadNpmTasks('grunt-contrib-cssmin');
		grunt.loadNpmTasks('grunt-file-append');
		grunt.loadNpmTasks('grunt-contrib-compress');
		grunt.loadNpmTasks('grunt-contrib-clean');

		var externs = conf.externs;
		var f = file.split('/')[0];
		var dir = 'dist/'+f;

		var cssMin = {};
		cssMin[dir+'/ol.min.css'] = ['builder/*.css'];

		var jsSourceMap = {};
		jsSourceMap[dir+'/ol.min.js'] = {append: "//@ sourceMappingURL=ol.min.js.map"};
		
		var fse = require('fs-extra');
		var fs = require('fs');
		fse.removeSync(dir);
		fse.mkdirsSync(dir);

		if (conf.libs){
			fs.link('lib',dir+'/lib');
			fs.link('builder',dir+'/builder');
		} 

		var sourceMap = null;
		if (conf.sourceMap){
			sourceMap = dir+'/ol.min.js.map';
		}


		var copileSrc = ['lib/goog','lib/ol3/build','lib/ol3/src','builder'];
		

		var wrapper = "(function(){%output%}).call(this);"
		
		//read ol3 configs
		var ol = grunt.file.readJSON('lib/ol3/config/ol.json');
		var extern = ol.compile.externs;
		var define = ol.compile.define;
		var jscomp_error = ol.compile.jscomp_error;

		//modify extern path
		var ext=[];
		for (var i=0,len=extern.length;i<len;i++){
			if (extern[i] != "externs/oli.js" && extern[i]!="externs/olx.js" || conf.onlyOl3){
				ext.push('lib/ol3/'+extern[i]);	
			}
			
		}

		ext= ext.concat(externs);
		var def=[];
		for (var i=0,len=define.length;i<len;i++){
			def.push("'"+define[i]+"'");
		}


		grunt.config.merge({
			closureDepsWriter: {
			  options: {
			    // [REQUIRED] To find the depswriter executable we need either the path to
			    //    closure library or the depswriter executable full path:
			    closureLibraryPath: 'lib/goog',

			    // [OPTIONAL] Define the full path to the executable directly.
			    //    If set it trumps 'closureLibraryPath' which will not be required.
			    depswriter: 'lib/goog/closure/bin/build/depswriter.py', // filepath to depswriter

			    // [OPTIONAL] Root directory to scan. Can be string or array
			    //root: ['source/ss', 'source/closure-library', 'source/showcase'],

			    // [OPTIONAL] Root with prefix takes a pair of strings separated with a space,
			    //    so proper way to use it is to suround with quotes.
			    //    can be a string or array
			    root_with_prefix: ['"lib/ol3/build lib/ol3/build"','"lib/ol3/src lib/ol3/src"','"builder builder"'],

			    // [OPTIONAL] string or array
			   // path_with_depspath: ''


			  },
			   // any name that describes your operation
			  ol3: {

			    // [OPTIONAL] Set file targets. Can be a string, array or
			    //    grunt file syntax (<config:...> or *)
			    //src: 'map.js',

			    // [OPTIONAL] If not set, will output to stdout
			    dest: dir+'/ol.js'

			  }
			},
			closureBuilder:  {

			  options: {
			    // [REQUIRED] Path to closure compiler
			    compilerFile: 'lib/compiler/compiler.jar',
				closureLibraryPath: 'lib/goog',
	  			builder: 'lib/goog/closure/bin/build/closurebuilder.py',
			    // [OPTIONAL] set to true if you want to check if files were modified
			    // before starting compilation (can save some time in large sourcebases)
			    checkModified: true,
				//namespaces:'olc',
				inputs:'builder/map.js',
			    //inputs: ['lib/goog/closure/goog','lib/ol3/src',  'builder'],
	 			compile: conf.compile,
			    // [OPTIONAL] Set Closure Compiler Directives here
			    compilerOpts: {
			       compilation_level: 'ADVANCED_OPTIMIZATIONS',
			       externs: ext,
			       define: def,
			       warning_level: 'verbose',
			       jscomp_off: jscomp_error,
			       summary_detail_level: 3,
			       output_wrapper: wrapper,
			       create_source_map: sourceMap
			    },
			    // [OPTIONAL] Set exec method options
			    execOpts: {
					//Set maxBuffer if you got message "Error: maxBuffer exceeded."
			        //Node default: 200*1024			       
			       maxBuffer: 999999 * 1024
			    } 
			  },

			  // any name that describes your task
			  ol3: {
			  
			    // [OPTIONAL] Target files to compile. Can be a string, an array of strings
			    // or grunt file syntax (<config:...>, *)
			    src: copileSrc,

			    // [OPTIONAL] set an output file
			    dest: dir+'/ol.min.js'
			  }
			},
			cssmin: {			 
			  	ol3: {files: cssMin}
			},
			file_append: {
			    default_options: {files: jsSourceMap }
		  	},
		  	compress: {
			  main: {
			    options: {
			      mode: 'gzip',
			      level: 7
			    },
			    files: [
			      // Each of the files in the src/ folder will be output to
			      // the dist/ folder each with the extension .gz.js
			      {expand: true, flatten: true, src: [dir+'/*.min.js'], dest: dir+'/gz/', ext: '.min.js'},
			      {expand: true, flatten: true, src: [dir+'/*.min.css'], dest: dir+'/gz/', ext: '.min.css'}
			    ]
			  }
			}
		});
	
		var tasks = ['closureBuilder:ol3','cssmin:ol3'];

		if (conf.deps){
			tasks.push('closureDepsWriter:ol3');
		}
		if (conf.compile && conf.sourceMap){
			tasks.push('file_append');
		}
		if (conf.gzip){
			tasks.push('compress');
		}
		if (conf.html){
			fse.copySync('builder/map.html',dir+"/"+f+".html");
		}
		
		grunt.task.run(tasks);

	});
};	

