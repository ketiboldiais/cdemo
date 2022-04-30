const testEmptyString = (val) => {
	return val === "";
};

export function isEmptyString(...args) {
	return args.reduce((val) => {
		return testEmptyString(val);
	})
}
