module.exports = function(grunt){

	grunt.registerTask('generate','generate Build File from maps config',function(){
		var a = grunt.option.flags();
		var conf=grunt.config.get('pkg').build;

		var buffer = grunt.file.read('maps/' + conf.file);
		var str = buffer.toString();
		str = str.replace(/\(/g, '( ');
		var res = str.match(/(\bol.*)+[|\(]/g);
		//grunt.log.writeln(res);
		var dep;
		var format ="goog.require('#');\n";
		var fs = require('fs');
		var txt="goog.provide('olc')\n";

		for (var i=0,len=res.length;i<len;i++){
			dep=res[i].replace('(','').replace('[','');
			if ((/^ol.proj./).test(dep)){
				txt += format.replace('#','ol.proj');	 
			}else if((/^ol.coordinate./).test(dep)){			
				txt += format.replace('#','ol.coordinate');	 
			}else{	
				txt +=format.replace('#',dep);	
			}
			
		}	

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
			
			
		grunt.file.write("builder/map.js", txt );
			

	});



};