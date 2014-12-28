module.exports = function(grunt){

	grunt.registerTask('updateLibs','update Libs Need for ol3',function(){
		grunt.loadNpmTasks('grunt-git');

		// Update or Download Google Clousure Library
		if (grunt.file.exists('lib/goog')){
			grunt.config.merge({
				gitpull: {		   
		    		goog: {
				      	options: {
							 cwd: "lib/goog"
				      	}
		    		}
	  			}
			});
			grunt.task.run('gitpull:goog');
		}else{
			grunt.config.merge({
				gitclone: {
					  goog: {
				            options: {
				                repository: '<%=pkg.goog.url%>',
				                directory: 'lib/goog',
				                recursive:true
				            }
				        }
		    	}
			});
			grunt.task.run('gitclone:goog');
		}

		// Update or Download ol3
		if (grunt.file.exists('lib/ol3')){
			grunt.config.merge({
				gitpull: {		   
		    		ol3: {
				      	options: {
							 cwd: "lib/ol3"
				      	}
		    		}
	  			}
			});
			grunt.task.run('gitpull:ol3');
		}else{
			grunt.config.merge({
				gitclone: {
					 ol3: {
			            options: {
			                repository: '<%=pkg.ol3.url%>',
			                directory: 'lib/ol3',
			                branch:"<%=pkg.ol3.branch%>",
			                recursive:true
			            }
			        }
		    	}
			});
			grunt.task.run('gitclone:ol3');
		}


		//Donwload http://dl.google.com/closure-compiler/compiler-latest.zip
		if(!grunt.file.exists('lib/compiler')){
			grunt.loadNpmTasks('grunt-downloadfile');
			grunt.loadNpmTasks('grunt-zip');
			grunt.loadNpmTasks('grunt-contrib-clean');
			grunt.config.merge({
				 downloadfile: {
				      files: [
				        {
				          url: 'http://dl.google.com/closure-compiler/compiler-latest.zip',
				          dest: 'lib',
				          name: 'compiler.zip'
				        }
				      ]
	  			},
	  			 unzip: {
	     			 'lib/compiler': 'lib/compiler.zip'
	    		},
	    		clean: {
	  				lib: ["lib/compiler.zip"]
				}

			});
			grunt.task.run(['downloadfile','unzip','clean:lib']);
		}	

	});

};