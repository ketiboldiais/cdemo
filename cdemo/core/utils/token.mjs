const getTokens = (string) => {
	const stringLength = string.length;
	let tokens = [];
	let i = 0;
	while (i < stringLength) {
		let character = string[i];
		if (character === "(" || character === ")") {
			tokens.push({ token: string[i], index: i });
		} else if (character !== " ") {
			let position = i;
			for (; i < stringLength; ++i) {
				character = string[i];
				if (character === " " || character === "(" || character === ")")
					break;
			}
			tokens.push({ token: string.slice(position, i), index: position });
			--i;
		}
		i++;
	}
	return tokens;
};

const a = "x + y = 2";
const b = getTokens(a);
console.log(b);

const tokenTypes = {
	"+": {
		arity: 2,
		eval: (a, b) => { return a + b; }
	}
}
