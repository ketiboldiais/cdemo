const _default = {
	containerWidth: 60,
	containerHeight: 40,
	svgWidth: 300,
	svgHeight: 300,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	},
};

const colorSchemes = {
	plainScheme: {
		fill: "#fff",
		stroke: "#000",
		text: "#000",
	},
	blueScheme: {
		fill: "#ebffff",
		stroke: "#1572A1",
		text: "#1572A1",
	},
	blackScheme: {
		fill: "#000",
		stroke: "#fff",
		text: "#fff",
	},
	greyScheme: {
		fill: "lightgrey",
		stroke: "slategrey",
		text: "slategrey",
	},
	greenScheme: {
		fill: "#f6ffe4",
		stroke: "#4E9F3D",
		text: "#4E9F3D",
	},
	yellowScheme: {
		fill: "#FFFDDE",
		stroke: "#EEBB4D",
		text: "#5E454B",
	},
	darkRedScheme: {
		fill: "orangered",
		stroke: "firebrick",
		text: "white",
	},
};

// palette selects a particular color palette
// example:
// palette('blueScheme') => returns colorSchemes.blueScheme
const palette = (color) => {
	let palette;
	switch (color) {
		case "blueScheme":
			palette = colorSchemes.blueScheme;
			break;
		case "greenScheme":
			palette = colorSchemes.greenScheme;
			break;
		case "darkRedScheme":
			palette = colorSchemes.darkRedScheme;
			break;
		case "yellowScheme":
			palette = colorSchemes.yellowScheme;
			break;
		case "plainScheme":
			palette = colorSchemes.plainScheme;
			break;
		case "greyScheme":
			palette = colorSchemes.greyScheme;
			break;
		default:
			palette = {
				fill: color.fill,
				stroke: color.stroke,
				text: color.text,
			};
	}
	return palette;
};

export { _default, palette }
