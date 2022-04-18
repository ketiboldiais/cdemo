class Utils {
	static init(_userValue, _default) {
		if (undefined !== _userValue && null !== _userValue) {
			return _userValue;
		} else {
			return _default;
		}
	}

	static makeSVG() {
	}
}

export default Utils;
