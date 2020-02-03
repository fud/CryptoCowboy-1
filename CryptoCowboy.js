import Wallet from './source/Wallet.js';
import Logger from "./source/Utility/Logger.js";
const log = new Logger(`CryptoCowboy`);

import XRPL_Wallet, { wallet_API } from './source/XRPL.Wallet.js';
import Algorithm, { algorithm_API } from "./source/Algorithm.js";

import WebPortal, { api as webPortal_API } from "./source/WebPortal.js";
const webPortal = new WebPortal();
webPortal.createHTTPServer(443);

wallet_API.registerConsumer(webPortal_API);
algorithm_API.registerConsumer(webPortal_API);

import { api } from "./source/Utility/API.js";
//const api = new API(`API`);
api.registerConsumer(webPortal_API);

import Database from './source/Database.js';
const database = new Database();

import Versioning from './Versioning.js';
const versioning = new Versioning();
const version = versioning.version;

import CLIArgument from "./source/Utility/CLIArguments.js";
const cliArgument = new CLIArgument();

//XRPL_Wallet_API.registerConsumer(WebPortal_API);

cliArgument.registerOption(`wallet`, `add`, async (id, address, secret) => 
{
	const x = `x`;
	const secretReplacement = x.repeat(secret.length);

	log.dev(`Add Wallet Option selected: ID: ${id}, address: ${address}, secret: ${secretReplacement}`);
	log.dev(`Removing Old wallet table`);
	database.removeTable(`wallet`);

	log.dev(`Creating new wallet table`);
	await database.createTable(`wallet`, [`id`, `address`, `secret`]);

	log.dev(`Writing wallet data`);
	await database.write(`wallet`,
		{
			id: id,
			address: address,
			secret: secret
		});

	log.info(`Added wallet`);
});

cliArgument.registerOption(`wallet`, `remove`, () => 
{
	log.dev(`Removing wallet table option selected`);
	database.removeTable(`Wallet`);
});

var clearOrders = false;
cliArgument.registerOption(`wallet`, `clearOrders`, () => 
{
	clearOrders = true;
});

var inflectionPoint = 0;
var primeAsset = ``;
var coAsset = ``;

cliArgument.registerOption(`algorithm`, `config`, async (iP, pA, cA) => 
{
	database.removeTable(`algorithm`);

	await database.createTable(`algorithm`, [`inflectionPoint`, `primeasset`, `coasset`]);

	await database.write(`algorithm`,
		{
			inflectionPoint: iP,
			primeasset: pA,
			coasset: cA
		});

	inflectionPoint = iP;
	primeAsset = pA;
	coAsset = cA;
});

cliArgument.registerOption(`test`, `out`, (...args) => 
{
	log.dev(`Test CLIArg: ${args}`);
});

cliArgument.registerFlag(`BV`, async () => 
{
	log.info(`Bumping Version [DEV TOOL ONLY]`);
	await versioning.increment();
});

cliArgument.registerFlag(`V`, () => 
{
	log.info(`Setting verbose Flag`);
	Logger.enableVerboseMode();
});

cliArgument.registerFlag(`D`, () => 
{
	log.info(`Setting Debug Flag`);
	Logger.enableDebugMode();
});

cliArgument.registerFlag(`DD`, () => 
{
	log.info(`Setting Dev Flag`);
	Logger.enableDevMode();
});

var startAlgo = false;
cliArgument.registerFlag(`S`, () => 
{
	startAlgo = true;
});

cliArgument.execute();

async function main()
{
	log.info(`Welcome to CryptoCowboy ${version}`);

	const listOfWallets = await database.read(`wallet`, [`id`, `address`, `secret`]);
	log.dev(`${listOfWallets.length} wallets found`);

	const getXRPLWallets = async () => 
	{
		const result = await database.read(`wallet`, [`id`, `address`, `secret`]);
		log.info(result);
		return result;
	};

	await Wallet.getWallets(getXRPLWallets);

	/**
	 * @type Wallet | XRPL_Wallet[]
	 */
	const wallets = [];
	listOfWallets.map((wallet) => 
	{
		wallets.push(new XRPL_Wallet(wallet));
	});

	const myWallet = wallets[0];
	const assets = await myWallet.getAssets();
	assets.map((asset) => 
	{
		const count = assets.reduce((currencyCount, countCurrency) => 
		{
			if (isNaN(currencyCount))
			{
				currencyCount = 0;
			}
			if (asset.currency == countCurrency.currency)
			{
				currencyCount++;
			}
			return currencyCount;
		});

		if (asset.value == 0)
		{
			return;
		}

		if (count > 1)
		{
			log.dev(`${asset.currency} (${asset.counterparty}): ${asset.value}`);
		}
		else
		{
			log.dev(`${asset.currency}: ${asset.value}`);
		}
	});

	//log.dev(`Testing API`);
	//API.request(`wallet`, `assets`, { id: myWallet.id });
	//setInterval(() => { log.dev(`Sending assets?`); API.request(`wallet`, `assets`, { id: myWallet.id }); }, 10000);


	if (clearOrders)
	{
		await myWallet.cancelAllOrders();
		process.exitCode = 1;
	}

	const algorithm = new Algorithm(myWallet);
	algorithm.inflectionPoint = inflectionPoint;

	let primeAssetsSet = false;
	let coAssetsSet = false;

	assets.forEach((value) => 
	{
		if (value.currency == primeAsset && !primeAssetsSet)
		{
			algorithm.primeAsset = value;
			primeAssetsSet = true;
		}

		if (value.currency == coAsset && !coAssetsSet)
		{
			algorithm.coAsset = value;
			coAssetsSet = true;
		}
	});

	if (!primeAssetsSet || !coAssetsSet)
	{
		log.error(`Assets not properly set.`);
		//process.exit();
		process.exitCode = 1;
	}
	//const api = new API();
	//const webPortal = new WebPortal(api.request);

	//webPortal.createHTTPServer(443);
	//webPortal.listen();

	if (startAlgo)
	{
		await algorithm.start();
	}
}

main().catch((error) => 
{
	log.error(`An error has occured in main!`);
	log.error(error);
	//process.exit(1);
	process.exitCode = 1;
});

process.on(`beforeExit`, (code) => 
{
	log.verbose(`Process beforeExit event with code: ${code}`);
});

process.on(`exit`, (code) => 
{
	log.verbose(`About to exit with code: ${code}`);
});