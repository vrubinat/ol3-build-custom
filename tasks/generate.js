module.exports = function(grunt,conf,file){

	grunt.registerTask('gen-'+file,'generate Build File from maps config',function(){
		//var a = grunt.option.flags();
		//var conf=grunt.config.get('pkg').build;
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-contrib-clean');


		var fse = require('fs-extra');
		var fs = require('fs');
		fse.removeSync('builder');
		fse.mkdirsSync('builder');
		// Create Js File from Map file with closure library deps
		
		var buffer = grunt.file.read('maps/' + file + ".js");
		var str = buffer.toString();
		//str = str.replace(/\(/g, '( ');
		var res = str.match(/(\bol.*\b)/g);
		//grunt.log.writeln(res);
		var dep;
		var format ="goog.require('#');\n";
		var fs = require('fs');
		var txt="goog.provide('olc')\n";
		var index;
		for (var i=0,len=res.length;i<len;i++){

			dep=res[i];
			index=res[i].indexOf(' ');
			
			if (index==-1)index=res[i].indexOf("(");
			if (index!=-1)dep=res[i].slice(0,index);
								
			if ((/.has./).test(dep)||(/^olx.*/).test(dep)||(/^oli.*/).test(dep)){
			}else if((/^ol.proj./).test(dep)){
				txt += format.replace('#','ol.proj');	 
			}else if((/^ol.coordinate./).test(dep)){			
				txt += format.replace('#','ol.coordinate');	
			}else if((/^ol.control.default/).test(dep)){
				txt += format.replace('#','ol.control');	
			}else{	
				txt +=format.replace('#',dep);	
			}
			
		}	

		


		if (conf.onlyOl3){
			var exp = grunt.file.readJSON('lib/ol_export.json');
			var exports;
			for (var i=0,len=res.length;i<len;i++){
				dep=res[i].replace('(','').replace('[','');				
				exports = exp[dep];
				if (exports){
					for ( var ii=0,len2=exports.length;ii<len2;ii++){
						txt+= exports[ii];
					}
				}
		}	

		}else{
			txt += "var Map = function(options){\n";
			txt += str;
			txt +="};\n\n";

			txt+= "if (goog.global.document.body){\n";
			txt+= "   new Map();\n";
			txt+="}else{\n";
			txt+="  goog.global.onload = function (){ \n";
			txt+="  new Map();\n";
			txt+="  }\n";
			txt+="}\n";
		}
		
		var jq = str.match(/(\$\(|\$.)/);
		if (jq && jq.length > 0)jq=true;

		// Copy Css files from ol3
		grunt.config.merge({
				copy: {
				  css: {
				    files: [
				      // includes ol3 files 
				      {expand: true, flatten: true,src: ['lib/ol3/css/*.css'], dest: 'builder/', filter: 'isFile'},
				      // includes file css from map
				      {expand: true, flatten: true,src: ['maps/'+file+".css"], dest: 'builder/'}

				    ]
				  }
				}
		});


		
		grunt.task.run(['copy:css']);
		grunt.file.write("builder/map.js", txt );
		
		if (fs.existsSync('maps/'+file+".html")){
			fse.copySync('maps/'+file+".html",'builder/map.html');
		}else{

			var html ="";
			html += "<html><head><meta charset='utf-8'><meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>";
			html +="<meta name='viewport' content='initial-scale=1.0, user-scalable=no, width=device-width'>";
			html +="<meta http-equiv='Content-Type' content='text/html; charset=utf-8'> ";
			html +="<link rel='stylesheet' type='text/css' href='ol.min.css'>";
			if(jq)html +="<script type='text/javascript' src='https://code.jquery.com/jquery-1.9.1.min.js'></script>";	
			if (conf.onlyOl3){
				html +="<script type='text/javascript' src='ol.min.js'></script>";	
			}else{
				html +="<script async type='text/javascript' src='ol.min.js'></script>";	
			}			
			html +="</head><body>";
			html +="<div id='map' ></div>";
		    if(conf.onlyOl3) html +="<script type='text/javascript'>" + str + "</script>";
			html +="</body></html>";	
			grunt.file.write("builder/map.html",html);

		}
		
			
	});

	return 'gen-'+file;

};