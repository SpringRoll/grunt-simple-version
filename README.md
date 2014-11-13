# Grunt Simple Version [![Dependency Status](https://david-dm.org/CloudKidStudio/grunt-simple-version.svg)](https://david-dm.org/CloudKidStudio/grunt-simple-version) [![Build Status](https://travis-ci.org/CloudKidStudio/grunt-simple-version.svg)](https://travis-ci.org/CloudKidStudio/grunt-simple-version)

Update the project version across your projects. Uses [Semantic Versioning](http://semver.org) format. 

## Requirements

* Install [Node JS](http://nodejs.org/)
* Install [Grunt](http://gruntjs.com/getting-started) `npm install -g grunt-cli`

## Setup

Sample **Gruntfile.js** below. The version tasks needs a map of file names as an option. The value is the name of the JSON field to change. For instance, both bower and package have fields called version, this will update in both places

```js
module.exports = function(grunt)
{
	grunt.loadNpmTasks('grunt-simple-version');

	grunt.initConfig({
		version: {
			options : {
				files : {
					'bower.json' : 'version',
					'package.json' : 'version'
				}
			}
		}
	});
};
```

Files to be versioned can take a string as the name of the JSON property or a function which takes the file contents and version as arguments. This example will add the version number to any href or src request inside an HTML file. 

```js
grunt.initConfig({
	version : {
		options : {
			files : {
				'bower.json' : 'version',
				'package.json' : 'version',
				'deploy/index.html' : function(contents, version){
					return contents.replace(
							/src\=(\"|\')([^\?\n\r\"\']+)(\?v\=[a-z0-9\.]*)?(\"|\')/ig, 
							'src="$2?v='+version+'"'
						)
						.replace(
							/href\=(\"|\')([^\?\n\r\"\']+\.css)(\?v\=[a-z0-9\.]*)?(\"|\')/ig, 
							'href="$2?v='+version+'"'
						);
				}
			}
		}
	}
});
```

## Usage

Ways to set the version across the project:

```bash
# Set a specific version
grunt version:1.0.0-rc

# Bump the patch version e.g., 1.0.1 => 1.0.2
grunt version:patch

# Bump the patch version e.g., 1.2.1 => 1.3.0
grunt version:minor

# Bump the patch version e.g., 1.3.0 => 2.0.0
grunt version:major
```