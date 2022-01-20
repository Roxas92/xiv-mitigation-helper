export const lerp = (value1: number, value2: number, amount: number): number => {
	let newAmount = amount < 0 ? 0 : amount;
	newAmount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * newAmount;
};

export const getClosestEntriesByValue = <P extends string, T extends { [U in P]: number }>(value: number, values: T[], trackBy: P): [previousEntry: T | undefined, nextEntry: T | undefined] => {
	const previousEntry = [...values].reverse().find((entry) => entry[trackBy] < value);
	const nextEntry = values.find((entry) => entry[trackBy] > value);

	const closestEntries = [previousEntry, nextEntry] as [T, T];

	return closestEntries;
};

export const timeToPixel = (time: number, ratio: number): number => {
	return time * ratio;
};

export const pixelToTime = (pixel: number, ratio: number): number => {
	return pixel / ratio;
};