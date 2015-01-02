ol3-custom-build
================

Project for create custom build from ol3


##Description


This project it's a tools for creating custom builds for OpenLayers3. For this job use [grunt] (http://gruntjs.com/) tasks. It's easy create build with grunt. 
This project only compile the funcionality that you need for get the minimal library possible. This is your ol3 personal library with you really need. 
The benefits of a custom compilation are to minimize loading time and reduce data traffic, the result is a faster page loading. In mobile devices this benefit is still more important.
With a custom build you can get a library from **160kb (56kb with Gzip)** and reduce  three times compared to using the complete library of OL3. Aditional  is minimized the number of http requests including the map definition with the ol3 library for creating a single file.

When you create a custom build the libraries automatically update at the last review.


##Dependencies

* python
* java => 1.6
* [Nodejs](http://nodejs.org/) => 0.8.0
* [grunt](http://gruntjs.com/)  => 0.4.5

##Getting Started

1. Download the project 
 * [git clone](https://github.com/vrubinat/ol3-build-custom.git)
 * [zip](https://github.com/vrubinat/ol3-build-custom/archive/master.zip)
2. Open cmd/Terminal and go to Project Dir.
3. npm --install ( Install all node_modules).
4. build a custom map execute: *grunt mapquest*

##Create Your Custom Map
1. Create your js map file in directory maps (It's possible create subdir) this contains the ol3 map definition.
Js File Example:

		var layers = [new ol.layer.Tile({
		visible: true,
		preload: Infinity,
		source: new ol.source.BingMaps({
			key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
			imagerySet: 'Road'
			})
		})];
	
		var map = new ol.Map({
	  		controls: [new ol.control.Zoom()],
	  		layers: layers,
	  		target: 'map',
	  		view: new ol.View({
	    		center: [-6655.5402445057125, 6709968.258934638],
	    		zoom: 13
	  		})
		});

2. [optional] Create your css file with same name that js file.
3. Open cmd/Terminal and go to Project Dir.
4. Exexute grunt #your file name#

##Results
1. Go to Dist folder in project dir.
2. You view a Folder that name is your js file.
3. The build process create this results:
 * ol.min.js -> Compiled Js File.
 * ol.min.css -> Minimized Css File.
 * ol.min.js.map [optional] -> Source Map for easy debug compiled file.
 * gz folder [optional]-> Contains gzip css and js files for best performance. (Recommended use in production)
 * ol.js [optional] -> Javascript Deps file for debug.
 * {filename}.html [optional] -> html file for test the custom build. 


## Working with custom build
1. Include css file in your html file in head section.
2. Include js file in your html file.
 * Include in head section before css file.
 * Include in body section before your html code. 
3. The map is loaded auto when page is load


##Aditional Info
In js map file is posible work with external library's for default it's possible work with Jquery testing (1.9), but it's posible use other external libs, for use this libs it's need create a extern file for Google Closure Compiler and include the extern file in config (Read optional params)

* [Create extern online](http://www.dotnetwise.com/Code/Externs/)
* [Google Docs](https://developers.google.com/closure/compiler/docs/api-tutorial3#no)
* [Externs libs](http://closureplease.com/externs/)


##Optional Params
The project include the package.json file, this file contains the aditional params and configurations.
####Build
* update : [true|false] if true get all change of ol3 and google clousure library
* gzip: [true|false] if true create a gzip files of css and js.
* compile: [true|false] if false not compile the js files and write a raw file.
* externs: [Array] path(relative) of extern files from use in js.
* sourceMap: [true|false] if true generate [sourceMap](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for debug compile files.
* html : [true|false] copy a html file from maps dir a dist dir or generate a basic html for view lib created.
* lib: [true|false] if true include the libs in dist folders. This is only for debug with deps or for working with [sourceMap](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)

####Libs
* url: Url of git repository for clone
* branch : branch for clone for default use master

>For apply change params in libs it's need delete the folder in libs dir and build the map another time.

##License

Copyright (c) 2014 Victor Rubinat

Licensed under the MIT license.




