import { NETWORKS_DETAILS } from '../constants/networks';
import { ENetwork } from '../types/post';
import BN from 'bn.js';

interface Options {
	numberAfterComma?: number;
	withUnit?: boolean;
	withThousandDelimitor?: boolean;
	compactNotation?: boolean;
}

export function formatBnBalance(value: string | BN, options: Options, network: ENetwork, assetId?: string | null): string {
	const tokenDecimals = assetId ? NETWORKS_DETAILS[`${network}`]?.supportedAssets[`${assetId}`]?.tokenDecimal : NETWORKS_DETAILS[`${network}`]?.tokenDecimals;

	const valueString = value instanceof BN ? value.toString() : value;

	let suffix = '';
	let prefix = '';

	if (valueString.length > tokenDecimals) {
		suffix = valueString.slice(-tokenDecimals);
		prefix = valueString.slice(0, valueString.length - tokenDecimals);
	} else {
		prefix = '0';
		suffix = valueString.padStart(tokenDecimals, '0');
	}

	const { numberAfterComma, withThousandDelimitor = true, withUnit, compactNotation = false } = options;

	if (numberAfterComma === 0 || !suffix) {
		suffix = '';
	} else if (numberAfterComma && numberAfterComma > 0) {
		suffix = suffix.slice(0, numberAfterComma);
	}

	let formattedValue: string;

	if (compactNotation) {
		const fullValue = parseFloat(`${prefix}.${suffix}`);
		// Use custom compact notation formatter that works reliably on both iOS and Android
		formattedValue = formatCompactNumber(fullValue, numberAfterComma || 2);
	} else {
		if (withThousandDelimitor) {
			// TODO:fix this
			// eslint-disable-next-line security/detect-unsafe-regex
			prefix = prefix.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		formattedValue = `${prefix}.${suffix}`;
	}

	const unit = withUnit ? (assetId ? NETWORKS_DETAILS[`${network}`]?.supportedAssets[`${assetId}`]?.symbol : NETWORKS_DETAILS[`${network}`]?.tokenSymbol) : '';

	return `${formattedValue} ${unit}`.trim();
}

// Custom compact number formatter that works across all platforms
function formatCompactNumber(num: number, digits: number): string {
	if (num === 0) return "0";
	
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "K" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "B" },
		{ value: 1e12, symbol: "T" }
	];
	
	// Find the appropriate suffix
	const item = [...lookup].reverse().find(item => num >= item.value);
	
	if (!item) return "0";
	
	// Calculate the scaled value with proper precision
	const scaledValue = num / item.value;
	const formattedValue = scaledValue.toFixed(digits);
	
	// Remove trailing zeros
	const cleanValue = formattedValue.replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");
	
	return cleanValue + item.symbol;
}