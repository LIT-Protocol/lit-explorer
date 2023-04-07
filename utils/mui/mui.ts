// -- render cols
export const appendEvenWidths = (arr: Array<object>, fullWidth: number) => {
	const width = fullWidth / arr.length;

	arr.forEach((item: any) => (item.width = width));

	return arr;
};
