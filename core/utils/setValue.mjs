const setValue = (userInput, defaultValue) => {
	if (userInput !== undefined && userInput !== null) {
		return userInput;
	} else {
		return defaultValue;
	}
};

export default setValue;
