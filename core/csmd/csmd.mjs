
export default class CSMD {
	constructor(obj) {
		this.OBJ = obj;

		this.BODY = d3.select("body");

		this.CONTAINER = document.querySelector(`#${this.OBJ.id}`);

		this.MARGIN = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		};

		this.CONTAINER_WIDTH = this.OBJ.container_width
			? `${this.OBJ.container_width}%`
			: "40%";

		this.CONTAINER_HEIGHT = this.OBJ.container_height
			? `${this.OBJ.container_height}%`
			: "40%";

		this.TH = () => {
			const TH = document.createElement("th");
			return TH;
		};

		this.TD = () => {
			const TD = document.createElement("td");
			return TD;
		};

		this.TR = () => {
			const TR = document.createElement("tr");
			return TR;
		};

		this.THEAD = () => {
			const THEAD = document.createElement("thead");
			return THEAD;
		};

		this.TBODY = () => {
			const TBODY = document.createElement("tbody");
			return TBODY;
		};

		this.TABLE = () => {
			const TABLE = document.createElement("table");
			return TABLE;
		};

		this.COLORS = {
			black: "#333",
			lightBlack: "#444444",
			white: "#FFF",
			beige: "#F9F3DF",
			lightBrown: "#CDB699",
			lightGreen: "#D5EEBB",
			darkGreen: "#529F00",
			forestGreen: "#238823",
			paleGreen: "#B4CFB0",
			paleYellowGreen: "#D3ECA7",
			blue: "#0077B6",
			darkBlue: "#006a97dc",
			purple: "#8946A6",
			tomato: "#FF6347",
			salmon: "#E83A14",
			pink: "#FE83C6",
			lavender: "#EA99D5",
			darkRed: "#A00000",
			orange: "#F0A500",
			teal: "#008080",
			lightGrey: "#CDCDCD",
			gold: "goldenrod",
			fireBrick: "firebrick",
			greyBlue: "#AECBD6",
		};

		this.fonts = {
			Mono: "system-ui",
			Serif: "CMU",
		};
	}
}