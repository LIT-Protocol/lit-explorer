// @ts-ignore
import converter from "hex2dec";
import { BigNumber, ethers } from "ethers";
import * as bitcoinjs from "bitcoinjs-lib";

export interface MultiTimeFormat {
	milliseconds: number;
	seconds: number;
	minutes: number;
}

export interface MultiETHFormat {
	wei: number;
	eth: number | string;
	arg: BigNumber;
}

export interface MultiDateFormat {
	timestamp: number;
	formatted: string;
}

// -- (helper) milliseconds converter
export const milliC = (milliseconds: number): MultiTimeFormat => {
	return {
		milliseconds,
		seconds: milliseconds / 1000,
		minutes: milliseconds / 1000 / 60,
	};
};

// -- (helper) wei to eth converter
export const wei2eth = (v: number): MultiETHFormat => {
	let cost: MultiETHFormat = {
		wei: v,
		// eth: ethers.utils.formatEther(v),
		eth: ethers.utils.formatUnits(v),
		arg: ethers.BigNumber.from(v),
	};

	return cost;
};

// convert this 2022-12-15T14:31:22.876Z to 2022-12-15
export const timestamp2Date = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
	// const date = require('date-and-time');
	// const format = 'YYYY/MM/DD HH:mm:ss';
	// let timestampFormatted : Date = new Date(parseInt(timestamp) * 1000);
	// return date.format(timestampFormatted, format);
};

// -- convert public key to address
export const pub2Addr = (pubKey: string) => {
	// const _pubKey = '025f37d20e5b18909361e0ead7ed17c69b417bee70746c9e9c2bcb1394d921d4ae';
	// const _pubKey = '03798a539c18f8209bddb6d79d72a954aad6ce8e24faef231637ed1a8278b419fb';
	const _pubKey = pubKey.replaceAll("0x", "");

	const EC = require("elliptic").ec;
	const keccak256 = require("js-sha3").keccak256;

	let address: string;

	try {
		const ec = new EC("secp256k1");

		// Decode public key
		const key = ec.keyFromPublic(_pubKey, "hex");
		// console.log("[pub2Addr] converted<key>:", key);

		// Convert to uncompressed format
		const publicKey = key.getPublic().encode("hex").slice(2);

		// Now apply keccak
		address = keccak256(Buffer.from(publicKey, "hex")).slice(64 - 40);
		// console.log("[pub2Addr] converted<publicKey>:", publicKey);
		// console.log("[pub2Addr] converted<address>:", address);

		return address;
	} catch (err) {
		address = "";
		console.log(err);
	}

	return address;
};

export const pub2BTC = (pubKey: string) => {
	const ECDSA_PUB_KEY = pubKey.replaceAll("0x", "");
	// console.log("[pub2BTC] input<ECDSA_PUB_KEY>:", ECDSA_PUB_KEY);

	const pubkey = Buffer.from(ECDSA_PUB_KEY, "hex");

	const { address } = bitcoinjs.payments.p2pkh({ pubkey });

	// console.log("[pub2BTC] converted<address>:", address);

	return address;
};

export const decimalTohex = (value: any) => {
	return converter.decToHex(value);
};

export const hexToDecimal = (value: string) => {
	return converter.hexToDec(value);
};

export const heyShorty = (addr: string, length = 10) => {
	if (!addr) {
		console.warn("heyShorty() -> addr cannot be empty.");
		return null;
	}

	return (
		addr.substring(0, length) +
		"..." +
		addr.substring(addr.length - length, addr.length)
	);
};
