module.exports = function(grunt)
{
	grunt.registerTask('version', 'Change the current project version', function(n){

		var _ = require('lodash'),
			path = require('path'),
			fs = require('fs'),
			semver = require('semver'),
			files = this.options(),
			packageFile = 'package.json',
			packageData = {},
			current = '0.0.1';

		if (fs.existsSync(packageFile))
		{
			packageData = grunt.file.readJSON(packageFile);
			if (!packageData.version)
			{
				grunt.fail.warn('package.json must contain a "version" key');
				packageData.version = current; // set default
			}
			current = packageData.version;
		}
		else
		{
			packageData.version = current;
			writeJSON(packageFile, packageData);
		}

		if (!n)
		{
			grunt.log.ok("Current version: " + current);
			grunt.fail.fatal("Attempting to change the version number, needs " + 
				"to be the semantic versioning number (e.g. 1.0.0) or either " +
				"major, minor or patch.");
		}

		// Valid types of preleases
		var types = ['major', 'minor', 'patch'];

		// The version to set to
		var version;

		// For semver format, replace the version
		if (n === "current")
		{
			grunt.log.ok('Current version: ' + current);
			return;
		}
		else if (semver.valid(n))
		{
			if (n == current)
			{
				grunt.fail.warn("Supplied version the same as the current version");
			}
			version = n;
		}
		else if (types.indexOf(n) > -1)
		{
			version = semver.inc(current, n);
		}
		else
		{
			grunt.fail.fatal("Argument on version task is not valid");
		}

		if (!semver.lt(current, version))
		{
			grunt.fail.warn("Attempting to revert to a lesser version (from " +
				current + " to " + version + ")");
		}

		grunt.log.ok("Version updated to " + version);

		packageData.version = version;
		writeJSON(packageFile, packageData);

		var isJSON = /\.json$/i;

		_.each(files, function(selection, file){

			var filePath = path.resolve(process.cwd(), file);

			if (!fs.existsSync(filePath))
			{
				grunt.fail.warn("The file to version '" + file + "' doesn't exist");
				return;
			}

			// The name of the json file property
			if (_.isString(selection))
			{
				if (!isJSON.test(filePath))
				{
					grunt.fail.warn("Attempting to update a version on a non-JSON file");
					return;
				}
				var fileData = grunt.file.readJSON(filePath);
				fileData[selection] = version;
				writeJSON(filePath, fileData);
				grunt.log.ok('Updated version in ' + file);
			}
			// Substitution plugin
			else if (_.isFunction(selection))
			{
				if (isJSON.test(file))
				{
					// function with json
					var json = selection(grunt.file.readJSON(filePath), version);
					writeJSON(filePath, data);
				}
				else
				{
					// Format a file
					var data = grunt.file.read(filePath);
					data = selection(data, version);
					grunt.file.write(filePath, data);
				}
				grunt.log.ok('Updated version in ' + file);
			}
		});
	});

	/**
	 * Write JSON to a local project file
	 * @param  {string} file Local project file
	 * @param  {object} data The javascript object
	 */
	function writeJSON(file, data)
	{
		grunt.file.write(file, JSON.stringify(data, null, "\t"));
	}
};