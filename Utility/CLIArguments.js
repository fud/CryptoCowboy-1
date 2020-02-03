import Logger from "./Logger.js";
const log = new Logger(`CLIArguments`);

const targets = new Map();
const flags = new Map();

export default class CLIArgument
{
	constructor()
	{
		this.args = process.argv.slice(2);
		log.dev(this.args);
	}

	execute()
	{
		const optionArguments = [];

		this.args.forEach((value, index, array) => 
		{
			const option = this.toOption(value);
			const flag = this.toFlag(value);

			const last = (index == array.length - 1);

			if (flag)
			{
				log.info(`Found flag ${flag}`);
				const flagCallback = flags.get(flag);
				flagCallback();
			}

			if (last && flag == false)
			{
				optionArguments.push(value);
			}

			if (option != false || flag != false || last)
			{
				if (optionArguments.length > 0)
				{
					log.info(`Found option: ${optionArguments}`);
					const targetObject = targets.get(optionArguments.shift());

					if (!targetObject)
					{
						optionArguments.length = 0;
						return;
					}

					const callback = targetObject[optionArguments.shift()];

					callback.apply(null, optionArguments);
					optionArguments.length = 0;
				}

				if (flag == false)
				{
					optionArguments.push(value);
				}
			}
			else
			{
				optionArguments.push(value);
			}
		});
	}

	toFlag(value)
	{
		const firstOne = value.substring(0, 1);
		const secondOne = value.substring(1, 2);
		if (firstOne == `-` && secondOne != `-`)
		{
			log.dev(`${value} is a flag`);
			return value.substring(1);
		}
		else
		{
			return false;
		}
	}

	toOption(value)
	{
		const firstTwo = value.substring(0, 2);
		if (firstTwo == `--`)
		{
			log.info(`${value} is an option`);
			return value.substring(2);
		}
		else
		{
			return false;
		}
	}

	registerOption(target, command, callback)
	{

		let targetObject = {};
		if (targets.has(`--${target}`))
		{
			log.dev(`Adding target: --${target}`);
			targetObject = targets.get(`--${target}`);
		}

		Object.defineProperty(targetObject, command,
			{
				value: callback,
				writable: false
			});

		targets.set(`--${target}`, targetObject);
	}

	registerFlag(flag, callback)
	{
		if (!flags.has(flag))
		{
			log.info(`Adding flag: ${flag}`);
			flags.set(flag, callback);
		}
		else
		{
			log.info(`Duplicate Flag`);
		}
	}
}