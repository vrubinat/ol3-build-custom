
function formatSymbolExport(name, namespace) {

  return 'goog.exportSymbol(\n' +
      '    \'' + name + '\',\n' +
      '    ' + name +
      (namespace ? ',\n    ' + namespace : '') + ');\n';
}


/**
 * Generate goog code to export a property.
 * @param {string} name Property long name (e.g. foo.Bar#baz).
 * @return {string} Export code.
 */
function formatPropertyExport(name) {
  var parts = name.split('#');
  var prototype = parts[0] + '.prototype';
  var property = parts[1];


  return 'goog.exportProperty(\n' +
      '    ' + prototype + ',\n' +
      '    \'' + property + '\',\n' +
      '    ' + prototype + '.' + property + ');\n';
}


/**
 * Generate export code given a list symbol names.
 * @param {Array.<Object>} symbols List of symbols.
 * @param {string|undefined} namespace Target object for exported symbols.
 * @return {string} Export code.
 */
function generateExports(symbols, namespace) {
  var blocks = [];
  var requires = {};
  symbols.forEach(function(symbol) {
    symbol.provides.forEach(function(provide) {
      //requires[provide] = true;
    });
    var name = symbol.name;
    
    if (name.indexOf('#') > 0) {
      if(requires[name.split('#')[0]]){
      	requires[name.split('#')[0]].push(formatPropertyExport(name));
      }else{
      	requires[name.split('#')[0]]=[formatPropertyExport(name)];
      }
      
      //blocks.push(formatPropertyExport(name));
    } else {
    	
      requires[name] = [formatSymbolExport(name, namespace)];
      //blocks.push(formatSymbolExport(name, namespace));
    }
  });
  //blocks.unshift('\n');
  //Object.keys(requires).sort().reverse().forEach(function(name) {
  //  blocks.unshift('goog.require(\'' + name + '\');');
  //});
  
 
  //return blocks.join('\n');
  return requires;
}

/**
 * Given the path to a source file, get the list of provides.
 * @param {string} srcPath Path to source file.
 * @param {function(Error, Array.<string>)} callback Called with a list of
 *     provides or any error.
 */
function getProvides(srcPath, callback) {
	var fs = require('fs');
    var data = fs.readFileSync(srcPath);
	var provides = [];
    var matcher = /goog\.provide\('(.*)'\)/;
    String(data).split('\n').forEach(function(line) {
      var match = line.match(matcher);
      if (match) {
        provides.push(match[1]);
      }
    });
    callback(null, provides);
};


/**
 * Add provides data to new symbols.
 * @param {Object} info Symbols and defines metadata.
 * @param {function(Error, Object)} callback Updated metadata.
 */
function addSymbolProvides(info, callback) {
	
  if (!info) {
    process.nextTick(function() {
      callback(null, null);
    });
    return;
  }
  
  function addProvides(symbol, callback) {
  	
    getProvides(symbol.path, function(err, provides) {
      if (err) {
        callback(err);
        return;
      }
      symbol.provides = provides;
      callback(null, symbol);
    });
  }
	var async = require('async'); 
	  async.map(info.symbols, addProvides, function(err, newSymbols) {
	    info.symbols = newSymbols;
	    callback(err, info);
	  });
}

module.exports = function(grunt,conf){

		grunt.registerTask('exports','Generate Json file with exports definitions for providers',function(){
			if (!conf.onlyOl3){
				return;
			}
			var spawn = require('child_process').spawn;
			var jsdoc = 'node_modules/.bin/jsdoc';
			var jsdocConfig = 'tasks/ol3-jsdoc-conf.json';
			var paths = ['lib/ol3/src', 'lib/ol3/externs/olx.js','lib/ol3/externs/geojson.js'];
			var cwd = __dirname+"/..";

			done = grunt.task.current.async();
			
			var child = spawn(jsdoc, ['-r','-c', jsdocConfig].concat(paths), {cwd: cwd});
			

			var output="";
			var errors="";
			child.stdout.on('data', function(data) {
				
			    output += String(data);
			});

			child.stderr.on('data', function(data) {
				
			    errors += String(data);
			});

			child.on('exit', function(code) {
			    if (code) {
			      done(errors);
			    } else {
			      var info;
			      try {
			        info = JSON.parse(String(output));
			        addSymbolProvides(info,function(err,i){			        	
						var js = generateExports(i.symbols);
						grunt.file.write("lib/ol_export.json",JSON.stringify(js));						
						done(errors);
				     });			        			        
			      } catch (err) {
			        
			        return;
			      }
			      
			    }
			});
			
		
		});

};