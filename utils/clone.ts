export const newObjectState = (obj: object, props?: any) => {
	let newObject: any = JSON.parse(JSON.stringify(obj));

	Object.keys(props).forEach((prop, i) => {
		const property = Object.keys(props)[i];
		const value = Object.values(props)[i];
		newObject[property] = value;
	});

	console.log(newObject);

	return newObject;
};
