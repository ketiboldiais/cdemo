import { isNotNull } from "./isNotNull.mjs";
import { isNotUndefined } from "./isNotUndefined.mjs";

const setValue = (userInput, defaultValue) => {
	if (isNotUndefined(userInput) && isNotNull(userInput)) {
		return userInput;
	} else {
		return defaultValue;
	}
};

export default setValue;
