export const arrayOfPropertyValues = (objectArray = [{}], key) => {
	const propertyValues = objectArray.map((element) => element[key]);
	return propertyValues;
};
