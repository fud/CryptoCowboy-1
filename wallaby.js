//files: [
//	"build/source/**/*.js"
//],
//tests: [
	//"build/tests/**/*.test.js"
//],

module.exports  = function (wallaby) {

	//var path = require('path');
	//process.env.NODE_PATH += path.delimiter + path.join(wallaby.localProjectDir, '.');
	//console.log(wallaby);
	//console.log(wallaby.localProjectDir);
	//wallaby.localProjectDir = wallaby.localProjectDir.replace("tests\\", "");
	//console.log(wallaby.localProjectDir);

	return {
		name: 'CryptoCowboy',
		files: [
			"./source/**/*.ts"
		],
		tests: [
			"./tests/**/*.test.ts"
		],
		delays:
		{
			//run: 150
		},
		env:
		{
			type: "node",
			params:
			{
				//runner: `-r ${require.resolve('esm')}`
			  }
		},
		compilers: {
			'**/*.ts?(x)': wallaby.compilers.typeScript({
					typescript: require('typescript'),
					module: 'commonjs',
        			jsx: 'React',
					useStandardDefaults: true,
					isolatedModules: true
				})
		  },
		//testFramework: 'jest',
		autoDetect: true,
		trace: true,
		preserveComments: false,
		reportConsoleErrorAsError: true,
		maxConsoleMessagesPerTest: 5000,
		slowTestThreshold: 200,
		lowCoverageThreshold: 99,
		runAllTestsInAffectedTestFile: true,
		maxLogEntrySize: 32768,
		workers:
		{
			restart: true
		},

		//screenshot: true,

		setup: function() {
			process.exit = function () {  };
			console.log('Starting Wallaby');
			console.log(wallaby);
		  },
		  teardown: function (wallaby) {
			console.log('Teardown');
			console.log('Current worker id: ' + wallaby.workerId);
			console.log('Current session id: ' + wallaby.sessionId);
		  },
		  workers: {
			restart: true
		  }

	};
};
