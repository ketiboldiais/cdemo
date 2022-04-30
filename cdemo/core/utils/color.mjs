import { isEmptyString } from "./isEmptyString.mjs";

class Color {
	#r;
	#g;
	#b;
	constructor(r, g, b, a = 1) {
		this.#r = r;
		this.#g = g;
		this.#b = b;
	}
	#innerRGB() {
		return `${this.#r},${this.#g},${this.#b}`;
	}
	rgb() {
		return `rgb(${this.#innerRGB()})`;
	}
	rgba(a = 1.0) {
		return `rgba(${this.#innerRGB()},${a})`;
	}
	hex() {
		const r = this.#r;
		const g = this.#g;
		const b = this.#b;
		const base = 1 << 24;
		const red = r << 16;
		const green = g << 8;
		const sum = base + red + green + b;
		const hexVal = sum.toString(16).slice(1);
		return `#${hexVal}`;
	}
}

export const color = {
	coffee: new Color(253, 246, 236),
	paleOrange: new Color(204, 115, 81),
	orange: new Color(235, 130, 66),
	banana: new Color(255, 235, 153),
	pastelLime: new Color(231, 251, 190),
	iceBlue: new Color(200, 242, 239),
	blue: new Color(21, 114, 161),
	powderBlue: new Color(143, 189, 211),
	paleBrown: new Color(205, 182, 153),
};

export const scheme = (
	primaryFillColor = "white",
	primaryStrokeColor = "black",
	primaryTextColor = "black",
	secondaryFillColor = primaryFillColor,
	secondaryStrokeColor = primaryStrokeColor,
	secondaryTextColor = primaryTextColor,
) => {
	return {
		primaryFillColor,
		primaryStrokeColor,
		primaryTextColor,
		secondaryFillColor,
		secondaryStrokeColor,
		secondaryTextColor,
	};
};

export const palette = (paletteName = "plain") => {
	switch (paletteName) {
		case "plain":
			return scheme("white", "black", "black", "lightgrey", "grey", "grey",);
		case "blue":
			return scheme("#ebffff", "#1572A1", "#1572A1");
		case "mint":
			return scheme("#EDFFEC", "#1597BB", "#1597BB")
		case "grey":
			return scheme("lightgrey", "slategrey", "slategrey")
		case "green":
			return scheme("#f6ffe4", "#4E9F3D", "#4E9F3D")
		case "yellow":
			return scheme("#FFFDDE", "#EEBB4D", "#BE8C63")
		case "orangeBlack":
			return scheme("#393E46", "#FA7D09", "#FFD700")
		case "darkRed":
			return scheme("orangered", "firebrick", "white")
		case "pinkYellow":
			return scheme("#F7ECDE", "#D885A3", "firebrick");
	}
};

export const colorSchemes = {
	plainScheme: {
		fill: "white",
		stroke: "black",
		text: "black",
	},
	blueScheme: {
		fill: "#ebffff",
		stroke: "#1572A1",
		text: "#1572A1",
	},
	mintScheme: {
		fill: "#EDFFEC",
		stroke: "#1597BB",
		text: "#1597BB",
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
		text: "#BE8C63",
	},
	orangeBlackScheme: {
		fill: "#393E46",
		stroke: "#FA7D09",
		text: "#FFD700",
	},
	darkRedScheme: {
		fill: "orangered",
		stroke: "firebrick",
		text: "white",
	},
};
