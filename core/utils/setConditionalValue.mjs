import { isNotNull } from "./isNotNull.mjs";
import { isNotUndefined } from "./isNotUndefined.mjs";

// Sets values for conditional properties

export const setConditionalValue = (
	property,
	value_if_property_is_set,
	value_if_property_is_not_set,
) => {
	if (isNotNull(property) && isNotUndefined(property)) {
		return value_if_property_is_set;
	} else {
		return value_if_property_is_not_set;
	}
};
