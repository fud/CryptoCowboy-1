// @ts-nocheck

import packageJSON from '../package.json';

import { getLastInteger, removeLastInteger } from "./CC_String.js";

import Logger from "./Logger.js";
const log = new Logger(`Versioning`);

import fs from "fs";

function replaceInFile(file, oldText, newText)
{
	log.dev(`Opening ${file}, replacing ${oldText} with ${newText}`);
	fs.readFile(file, `utf8`, function (err, data)
	{
		if (err)
		{
			return log.error(err);
		}

		const search = new RegExp(oldText, `g`);

		const result = data.replace(search, newText);

		fs.writeFile(file, result, `utf8`, function (err)
		{
			if (err) return log.error(err);
		});
	});
}

export default class Versioning
{
	constructor()
	{
		//this.files = [`./package.json`, `./README.md`];
		this.files = [`./test.txt`];
		this.version = packageJSON.version;
	}

	increment()
	{
		const newVersion = removeLastInteger(this.version) + String(getLastInteger(this.version) + 1);

		this.files.forEach((file) => 
		{
			replaceInFile(file, this.version, newVersion);
		});
	}
}