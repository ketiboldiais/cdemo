import CSMD from "../csmd/csmd.mjs";
import { isNotNull } from "../utils/isNotNull.mjs";
import { isNotUndefined } from "../utils/isNotUndefined.mjs";
import setValue from "../utils/setValue.mjs";

export default class D3Base extends CSMD {
	constructor(obj) {
		super(obj);
		this.OBJ = obj;
		this.data = obj.data;

		this.mainFontSize = setValue(this.OBJ.mainFontSize, "0.8rem");

		this.secondaryFontSize = setValue(
			this.OBJ.secondaryFontSize,
			"0.7rem",
		);

		this.defaultPalette = "plainScheme";

		this.D3_CONTAINER = this.BODY.selectAll(`#${this.OBJ.id}`);

		this.D3_CONTAINER.style(
			"display",
			setValue(this.OBJ.display, "flex"),
		)
			.style(
			"justify-content",
			setValue(this.OBJ.justifyContent, "center"),
		);

		this.styles = {
			font: this.OBJ.styles ? this.OBJ.styles?.font : "system-ui",
			fontSize: this.OBJ.styles ? this.OBJ.styles?.fontSize : "0.7rem",
		};
	}

	colorSchemes = () => {
		return {
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
	};

	palette = (color) => {
		let palette;
		if (color === undefined || color === null) {
			return (palette = undefined);
		}
		switch (color) {
			case "blueScheme":
				palette = this.colorSchemes().blueScheme;
				break;
			case "mintScheme":
					palette = this.colorSchemes().mintScheme;
					break;
			case "greenScheme":
				palette = this.colorSchemes().greenScheme;
				break;
			case "darkRedScheme":
				palette = this.colorSchemes().darkRedScheme;
				break;
			case "yellowScheme":
				palette = this.colorSchemes().yellowScheme;
				break;
			case "plainScheme":
				palette = this.colorSchemes().plainScheme;
				break;
			case "greyScheme":
				palette = this.colorSchemes().greyScheme;
				break;
			case "orangeBlackScheme":
				palette = this.colorSchemes().orangeBlackScheme;
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

	colors() {
		const palette = setValue(
			this.palette(this.OBJ.palette),
			this.palette(this.defaultPalette),
		);
		return {
			fillColor: palette.fill,
			strokeColor: palette.stroke,
			textColor: palette.text,
		};
	}

	generateDataFromArray(arr) {
		let data = [];
		for (let i = 0; i < arr.length; i++) {
			if (typeof arr[i] === "object") {
				data.push(arr[i]);
			} else {
				let obj = { val: arr[i] };
				data.push(obj);
			}
		}
		return data;
	}

	setMargin(top, right, bottom, left) {
		const userMarginTop = this.OBJ.margins ? this.OBJ.margins[0] : null;
		const userMarginLeft = this.OBJ.margins ? this.OBJ.margins[1] : null;
		const userMarginBottom = this.OBJ.margins ? this.OBJ.margins[2] : null;
		const userMarginRight = this.OBJ.margins ? this.OBJ.margins[3] : null;
		const margins = {
			top: setValue(userMarginTop, top),
			left: setValue(userMarginLeft, left),
			bottom: setValue(userMarginBottom, bottom),
			right: setValue(userMarginRight, right),
		};
		return margins;
	}

	setSVGDimensions(svg_width, svg_height) {
		let svgWidth = setValue(this.OBJ.svg_width, svg_width);
		let svgHeight = setValue(this.OBJ.svg_height, svg_height);
		const dimensions = {
			width: svgWidth - this.margins().left - this.margins().right,
			height: svgHeight - this.margins().top - this.margins().bottom,
		};
		return dimensions;
	}

	setContainerWidthDefault(defaultValue) {
		if (isNotNull(this.OBJ.width) && isNotUndefined(this.OBJ.width)) {
			return `${this.OBJ.width}%`;
		} else {
			return `${defaultValue}%`;
		}
	}
	setContainerWidthDefault(defaultValue) {
		if (isNotNull(this.OBJ.height) && isNotUndefined(this.OBJ.height)) {
			return `${this.OBJ.height}%`;
		} else {
			return `${defaultValue}%`;
		}
	}

	setContainerHeightDefault(defaultValue) {
		return setValue(this.OBJ.height, `${defaultValue}%`);
	}

	generateSVGContainer(a, b) {
		const containerWidth = this.setContainerWidthDefault(a);
		const containerHeight = this.setContainerHeightDefault(b);
		const svgContainer = this.D3_CONTAINER.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", containerWidth)
			.style("padding-bottom", containerHeight)
			.style("overflow", "hidden");
		return svgContainer;
	}

	generateSVG() {
		const SVG = this.SVG_CONTAINER.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${
					this.svg().width + this.margins().left + this.margins().right
				} ${
					this.svg().height + this.margins().top + this.margins().bottom
				}`,
			)
			.style("display", "inline-block")
			.style("position", "absolute")
			.style("top", "0")
			.style("left", "0")
			.append("g")
			.attr(
				"transform",
				`translate(${this.margins().left}, ${this.margins().top})`,
			);
		return SVG;
	}

	insertArrowDefinitions(obj) {
		const { id, refX, refY, markerWidth, markerHeight, orient, fill } =
			obj;
		this.SVG.append("svg:defs")
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", id)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", refX)
			.attr("refY", refY)
			.attr("markerWidth", markerWidth)
			.attr("markerHeight", markerHeight)
			.attr("orient", orient)
			.attr("fill", fill)
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
	}
}
