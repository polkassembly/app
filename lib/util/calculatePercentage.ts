import BN from 'bn.js';

export const calculatePercentage = (value: string | number, totalValue: BN | number) => {
	if (totalValue instanceof BN) {
		if (totalValue.isZero()) return 0;
		const valueBN = new BN(value.toString());
		const hundred = new BN(100);
		const result = valueBN.mul(hundred).mul(hundred).div(totalValue);
		return result.toNumber() / 100;
	}
	if (totalValue === 0) return 0;
	return (Number(value) * 100) / totalValue;
};
