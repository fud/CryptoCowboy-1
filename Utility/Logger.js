/* eslint-disable no-console */
import fs from "fs";

var DEV_MODE = false;
var DEBUG_MODE = false;
var VERBOSE_MODE = false;

const dev = `\x1b[35m`;	//	Highlight
const debug = `\x1b[96m`;	//	Grey
const verbose = `\x1b[90m`; 	//	White
const info = `\x1b[0m`;	//	Bright White
const warning = `\x1b[1m\x1b[33m`;	//	Yellow
const error = `\x1b[1m\x1b[31m`;	//	Red
const success = `\x1b[1m\x1b[32m`;	//	Green

const title = `\x1b[1m\x1b[37m`;

const reset = `\x1b[0m`;	//	White

var lastModule = ``;

function parseType(data)
{
	if (typeof (data) == `string`)
	{
		//console.log(`String`);
		return data;
	}
	else
	{
		//	TODO: Object highlighting
		//log.warning(`Data type not yet supported, attempting to parse`);
		return (`\n${JSON.stringify(data, null, 2)}`);
	}
}

/*
function strings(key, value) 
{
	// Filtering out properties
	if (typeof value === `string`) 
	{
		return undefined;
	}
	return value;
}

function keys(...args) 
{
	let selectedKeys = [];
	args.map((key) => 
	{
		selectedKeys.push(key);
	});

	return selectedKeys;
}
*/

const logQueue = [];
var writing = false;

function saveLog(fileName, data)
{
	logQueue.push(data);
	if (writing)
	{
		return;
	}
	handleLogQueue(fileName);
}

function handleLogQueue(fileName)
{
	if (logQueue.length == 0)
	{
		return;
	}

	if (logQueue[0] == undefined || writing)
	{
		return;
	}
	writing = true;
	const nextLine = logQueue.shift();

	fs.open(`${fileName}.log`, `a+`, (err, fd) =>
	{
		if (err)
		{
			if (err.code === `EEXIST`)
			{
				console.error(`myfile already exists`);
				return;
			}
			throw err;
		}

		fs.appendFile(fd, nextLine, `utf8`, (err) =>
		{
			fs.close(fd, (err) =>
			{
				if (err)
				{
					throw err;
				}

				if (logQueue.length > 0)
				{
					handleLogQueue();
				}
				else
				{
					writing = false;
				}

			});

			if (err)
			{
				throw err;
			}

			console.log(`The "data to append" was appended to file!`);
		});
	});
}


export default class Logger
{
	constructor(id)
	{
		this.id = id;
	}

	static enableVerboseMode()
	{
		VERBOSE_MODE = true;
	}

	static enableDebugMode()
	{
		VERBOSE_MODE = true;
		DEBUG_MODE = true;
	}

	static enableDevMode()
	{
		VERBOSE_MODE = true;
		DEBUG_MODE = true;
		DEV_MODE = true;
	}

	//	Logging message that should be deleted
	dev(data)
	{
		if (!DEV_MODE)
		{
			return;
		}
		const message = parseType(data);

		this.group();

		console.log(`${title}${this.id}: ${dev}${message}${reset}`);
	}

	//	Logging messages intended for debugging issues
	debug(data)
	{
		if (!DEBUG_MODE)
		{
			return;
		}
		const message = parseType(data);

		this.group();

		console.log(`${title}${this.id}: ${debug}${message}${reset}`);
	}

	//	Logging messages intended for giving insight into the inner workings of functionality
	verbose(data)
	{
		if (!VERBOSE_MODE)
		{
			return;
		}

		const message = parseType(data);
		this.group();

		console.log(`${title}${this.id}: ${verbose}${message}${reset}`);
	}

	//	Standard logging messages
	info(data)
	{
		const message = parseType(data);

		this.group();

		console.log(`${title}${this.id}: ${info}${message}${reset}`);
		saveLog(`info`, message);
	}

	//	Logging messages for non-critical issues
	warning(data)
	{
		const message = parseType(data);

		this.group();

		console.log(`${title}${this.id}: ${warning}${message}${reset}`);
		saveLog(`info`, `Warning: ${message}`);
		saveLog(`warning`, `Warning: ${message}`);
	}

	//	Warning alias
	warn(data)
	{
		const message = parseType(data);

		this.group();

		console.log(`${title}${this.id}: ${warning}${message}${reset}`);
		saveLog(`info`, `Warning: ${message}`);
		saveLog(`warning`, `Warning: ${message}`);
	}

	//	Logging messages for critial issues
	error(data)
	{
		this.group();

		if (typeof (data) != `string`)
		{
			console.error(data);
		}
		else
		{
			console.log(`${title}${this.id}: ${error}${data}${reset}`);
			saveLog(`info`, `Error: ${data}`);
			saveLog(`warning`, `Error: ${data}`);
			saveLog(`error`, `Error: ${data}`);
		}
	}

	//	Logging messages for good things.
	success(data)
	{
		const message = parseType(data);

		this.group();

		console.log(`${title}${this.id}: ${success}${message}${reset}`);
		saveLog(`info`, `Success: ${data}`);
	}

	group()
	{
		if (lastModule != this.id)
		{
			console.log(` `);
			lastModule = this.id;
		}
	}

	//	Test all logging functions
	testLoggers()
	{
		console.log(`Testing Logging modes. Ensure the following 7 messages are legible:`);

		this.dev(`1: Testing Dev`);
		this.debug(`2: Testing Debug`);
		this.verbose(`3: Testing Verbose`);
		this.info(`4: Testing Info`);
		this.warning(`5: Testing Warning`);
		this.error(`6: Testing Error`);
		this.success(`7: Testing Success`);
	}
}

const log = new Logger(`Logger`);